import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "./fixtures";
import { PATHS } from "./i18nAudit";

/**
 * Avtomatik tekshiruv barcha muammoni topmaydi (klaviatura oqimi, mantiqiy
 * tartib qo'lda tekshiriladi), lekin kontrast, yorliqsiz maydon va noto'g'ri
 * ARIA kabi mashina ko'radigan xatolarni ushlaydi — ular aynan sezilmasdan
 * qolib ketadiganlari.
 *
 * `serious` va `critical` darajalar qat'iy: ular ekran o'quvchi yoki
 * klaviatura bilan ishlashni buzadi.
 */
const BLOCKING = ["serious", "critical"];

for (const [path, label] of PATHS) {
  test(`a11y: ${label}`, async ({ page, goto }) => {
    await goto(path);

    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const blocking = violations.filter((v) =>
      BLOCKING.includes(v.impact ?? ""),
    );

    // Xato bo'lsa qaysi element ekani ko'rinib tursin
    const report = blocking.map((v) => ({
      rule: v.id,
      impact: v.impact,
      help: v.help,
      nodes: v.nodes.slice(0, 3).map((n) => n.target.join(" ")),
    }));

    expect(report).toEqual([]);
  });
}
