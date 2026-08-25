import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const createClient = vi.fn();
const captureException = vi.fn();
const setTag = vi.fn();

vi.mock("@/monitoring/client", () => ({
  createClient,
  captureException,
  setTag,
}));

/** Modul DSN'ni import paytida o'qiydi, shuning uchun har safar yangidan */
const loadModule = async (dsn?: string) => {
  vi.resetModules();

  if (dsn) vi.stubEnv("VITE_SENTRY_DSN", dsn);
  else vi.stubEnv("VITE_SENTRY_DSN", "");

  return import("@/monitoring");
};

beforeEach(() => {
  createClient.mockClear();
  captureException.mockClear();
  setTag.mockClear();
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("DSN berilmaganda", () => {
  it("monitoring o'chiq va Sentry yuklanmaydi", async () => {
    const monitoring = await loadModule();

    await monitoring.initMonitoring();

    expect(createClient).not.toHaveBeenCalled();
  });

  it("xato yuborilmaydi, lekin chaqiruv yiqilmaydi", async () => {
    const monitoring = await loadModule();

    expect(() => monitoring.captureError(new Error("bo'ldi"))).not.toThrow();
    expect(captureException).not.toHaveBeenCalled();
  });
});

describe("DSN berilganda", () => {
  const DSN = "https://key@o1.ingest.sentry.io/1";

  it("bir vaqtda chaqirilsa mijozni bir marta yaratadi", async () => {
    const monitoring = await loadModule(DSN);

    await Promise.all([
      monitoring.initMonitoring(),
      monitoring.initMonitoring(),
    ]);

    expect(createClient).toHaveBeenCalledTimes(1);
    expect(createClient).toHaveBeenCalledWith(DSN);
  });

  it("keyin qayta chaqirilsa ham mijoz qayta yaratilmaydi", async () => {
    const monitoring = await loadModule(DSN);

    await monitoring.initMonitoring();
    await monitoring.initMonitoring();

    expect(createClient).toHaveBeenCalledTimes(1);
  });

  it("yuklanguncha yuz bergan xatoni saqlab, keyin yuboradi", async () => {
    const monitoring = await loadModule(DSN);
    const error = new Error("erta xato");

    // Sentry hali yuklanmagan
    monitoring.captureError(error, "<Product>");
    expect(captureException).not.toHaveBeenCalled();

    await monitoring.initMonitoring();

    expect(captureException).toHaveBeenCalledTimes(1);
    expect(captureException).toHaveBeenCalledWith(error, {
      contexts: { react: { componentStack: "<Product>" } },
    });
  });

  it("ikki marta ishga tushirilsa ham navbat bir marta yuboriladi", async () => {
    const monitoring = await loadModule(DSN);

    monitoring.captureError(new Error("bir marta"));

    await monitoring.initMonitoring();
    await monitoring.initMonitoring();

    expect(captureException).toHaveBeenCalledTimes(1);
  });

  it("navbat cheksiz o'smaydi", async () => {
    const monitoring = await loadModule(DSN);

    for (let i = 0; i < 100; i++) monitoring.captureError(new Error(`#${i}`));

    await monitoring.initMonitoring();

    expect(captureException.mock.calls.length).toBeLessThanOrEqual(20);
  });

  it("yuklangandan keyin xatoni to'g'ridan-to'g'ri yuboradi", async () => {
    const monitoring = await loadModule(DSN);
    await monitoring.initMonitoring();

    monitoring.captureError(new Error("kech xato"));

    expect(captureException).toHaveBeenCalledTimes(1);
  });

  it("yuklashdagi xato ilovani qulatmaydi", async () => {
    createClient.mockImplementationOnce(() => {
      throw new Error("bloklangan");
    });
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    const monitoring = await loadModule(DSN);

    await expect(monitoring.initMonitoring()).resolves.toBeUndefined();
    expect(warn).toHaveBeenCalled();

    warn.mockRestore();
  });

  it("til tegini yuklashdan oldin tanlansa ham qo'yadi", async () => {
    const monitoring = await loadModule(DSN);

    monitoring.setMonitoringLanguage("ru");
    await monitoring.initMonitoring();

    expect(setTag).toHaveBeenCalledWith("language", "ru");
  });
});
