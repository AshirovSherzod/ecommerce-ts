import { describe, expect, it } from "vitest";
import type { ErrorEvent } from "@sentry/browser";
import { scrubEvent, scrubText } from "@/monitoring/scrub";

const TOKEN_URL =
  "https://api.telegram.org/bot7123456789:AAHdqTcvCH1vGWJxfSeofSAs0K5PALDsaw/sendMessage";

describe("scrubText", () => {
  it("Telegram tokenini manzildan olib tashlaydi", () => {
    const clean = scrubText(TOKEN_URL);

    expect(clean).not.toContain("AAHdqTcvCH1vGWJxfSeofSAs0K5PALDsaw");
    expect(clean).not.toContain("7123456789");
    expect(clean).toBe("https://api.telegram.org/bot[redacted]/sendMessage");
  });

  it("bir matndagi bir nechta tokenni tozalaydi", () => {
    const clean = scrubText(`${TOKEN_URL} va yana ${TOKEN_URL}`);

    expect(clean).not.toContain("AAHdq");
  });

  it("boshqa matnga tegmaydi", () => {
    const text = "Request failed with status code 404";

    expect(scrubText(text)).toBe(text);
  });

  it("matn bo'lmagan qiymatni o'zgartirmaydi", () => {
    expect(scrubText(undefined)).toBeUndefined();
    expect(scrubText(42)).toBe(42);
  });
});

describe("scrubEvent", () => {
  it("xabar, so'rov manzili, istisno va breadcrumb'larni tozalaydi", () => {
    const event = {
      message: `POST ${TOKEN_URL}`,
      request: { url: TOKEN_URL },
      exception: {
        values: [
          { type: "AxiosError", value: `Request to ${TOKEN_URL} failed` },
        ],
      },
      breadcrumbs: [
        { message: `xhr ${TOKEN_URL}` },
        { data: { url: TOKEN_URL, method: "POST" } },
      ],
    } as unknown as ErrorEvent;

    const clean = scrubEvent(event);

    // Butun hodisada token qolmasligi kerak
    expect(JSON.stringify(clean)).not.toContain("AAHdq");
    expect(clean.breadcrumbs?.[1].data?.method).toBe("POST");
  });

  it("bo'sh hodisada yiqilmaydi", () => {
    expect(() => scrubEvent({} as ErrorEvent)).not.toThrow();
  });
});
