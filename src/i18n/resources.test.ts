import { describe, expect, it } from "vitest";
import { resources } from "@/i18n/resources";
import { DEFAULT_LANGUAGE, LANGUAGES, NAMESPACES } from "@/i18n/config";

type Json = Record<string, unknown>;

/** Ichma-ich obyektni "a.b.c" ko'rinishidagi tekis kalitlar ro'yxatiga aylantiradi */
const flatten = (value: Json, prefix = ""): string[] =>
  Object.entries(value).flatMap(([key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key;

    return child !== null && typeof child === "object" && !Array.isArray(child)
      ? flatten(child as Json, path)
      : [path];
  });

const bundleOf = (lang: string, ns: string) =>
  resources[lang as keyof typeof resources][ns as never] as Json;

/**
 * i18next ko'plik shakllarini `key_one`, `key_few` kabi qo'shimchalar bilan
 * yozadi va ularning to'plami tilga qarab farq qiladi: o'zbekchada ikkita,
 * ruschada to'rtta. Solishtirishda qo'shimchani olib tashlaymiz.
 */
const PLURAL_SUFFIX = /_(zero|one|two|few|many|other)$/;

const baseKeysOf = (lang: string, ns: string) =>
  [
    ...new Set(
      flatten(bundleOf(lang, ns)).map((key) => key.replace(PLURAL_SUFFIX, "")),
    ),
  ].sort();

const valueAt = (bundle: Json, key: string) =>
  key.split(".").reduce<unknown>((acc, part) => (acc as Json)?.[part], bundle);

/**
 * Tarjima yetishmasa i18next zaxira tilga tushadi va interfeysda ikki til
 * aralashib ketadi — bu testsiz sezilmasdan qolib ketardi.
 */
describe("locale kalitlari", () => {
  it("har bir til uchun barcha namespace mavjud", () => {
    for (const { code } of LANGUAGES) {
      for (const ns of NAMESPACES) {
        expect(resources[code]?.[ns], `${code}/${ns}`).toBeDefined();
      }
    }
  });

  const others = LANGUAGES.filter(({ code }) => code !== DEFAULT_LANGUAGE);

  for (const { code } of others) {
    for (const ns of NAMESPACES) {
      it(`${code}/${ns} kalitlari ${DEFAULT_LANGUAGE} bilan bir xil`, () => {
        expect(baseKeysOf(code, ns)).toEqual(baseKeysOf(DEFAULT_LANGUAGE, ns));
      });
    }
  }

  it("ko'plik shakllari til qoidasiga to'liq mos", () => {
    for (const { code } of LANGUAGES) {
      const required = new Intl.PluralRules(code).resolvedOptions()
        .pluralCategories;

      for (const ns of NAMESPACES) {
        const keys = flatten(bundleOf(code, ns));
        const plurals = new Set(
          keys
            .filter((key) => PLURAL_SUFFIX.test(key))
            .map((key) => key.replace(PLURAL_SUFFIX, "")),
        );

        for (const base of plurals) {
          for (const category of required) {
            expect(keys, `${code}/${ns}:${base}_${category}`).toContain(
              `${base}_${category}`,
            );
          }
        }
      }
    }
  });

  it("bo'sh tarjima yo'q", () => {
    for (const { code } of LANGUAGES) {
      for (const ns of NAMESPACES) {
        const bundle = bundleOf(code, ns);

        for (const key of flatten(bundle)) {
          expect(
            String(valueAt(bundle, key)).trim(),
            `${code}/${ns}:${key}`,
          ).not.toBe("");
        }
      }
    }
  });

  it("interpolyatsiya o'zgaruvchilari barcha tilda bir xil", () => {
    const vars = (text: string) =>
      [...text.matchAll(/\{\{\s*(\w+)/g)].map((match) => match[1]).sort();

    for (const ns of NAMESPACES) {
      const base = bundleOf(DEFAULT_LANGUAGE, ns);

      for (const key of flatten(base)) {
        const expected = vars(String(valueAt(base, key)));

        if (expected.length === 0) continue;

        for (const { code } of others) {
          const value = valueAt(bundleOf(code, ns), key);

          // Ko'plik shakli boshqa tilda boshqacha nomlanishi mumkin
          if (value === undefined) continue;

          expect(vars(String(value)), `${code}/${ns}:${key}`).toEqual(expected);
        }
      }
    }
  });
});
