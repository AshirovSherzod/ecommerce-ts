const DSN = import.meta.env.VITE_SENTRY_DSN?.trim();

/*
 * Monitoring DSN berilgandagina yoqiladi. Berilmasa ilova butunlay
 * o'zgarishsiz ishlaydi va Sentry bundle'i umuman yuklab olinmaydi —
 * shuning uchun quyida dinamik `import()` ishlatilgan: statik import
 * bo'lganda paket DSN sozlanmagan loyihada ham foydalanuvchiga yetib
 * borardi.
 */

interface PendingError {
  error: Error;
  componentStack?: string | null;
}

// Sentry yuklanguncha yuz bergan xatolar yo'qolmasligi uchun navbat.
// Cheklangan: yuklash umuman muvaffaqiyatsiz bo'lsa xotira o'smasin.
const PENDING_LIMIT = 20;
const pending: PendingError[] = [];

type Client = typeof import("@/monitoring/client");

let client: Client | null = null;
let starting: Promise<void> | null = null;
// Til Sentry yuklanishidan oldin ham tanlangan bo'lishi mumkin
let language: string | null = null;

const send = ({ error, componentStack }: PendingError) => {
  client?.captureException(error, {
    contexts: componentStack ? { react: { componentStack } } : undefined,
  });
};

/**
 * Monitoringni ishga tushiradi. Bir necha marta chaqirilsa ham bir marta
 * yuklaydi. Xato tashlamaydi: monitoringning o'zi ilovani qulatmasligi
 * kerak — u aynan qulashlarni kuzatish uchun turibdi.
 */
export const initMonitoring = (): Promise<void> => {
  if (!DSN) return Promise.resolve();
  if (starting) return starting;

  starting = import("@/monitoring/client")
    .then((module) => {
      module.createClient(DSN);
      client = module;

      if (language) module.setTag("language", language);

      // Navbatni bo'shatamiz: takroriy yuborishdan yuqoridagi `starting`
      // himoya qiladi, `splice` esa xatolarga ushlab turilgan havolalarni
      // qo'yib yuboradi
      for (const item of pending.splice(0)) send(item);
    })
    .catch((error: unknown) => {
      // Reklama bloklovchilar Sentry'ni to'sishi mumkin — bu ilova uchun
      // muammo emas, lekin sababi bilinmasdan qolmasin
      console.warn("[monitoring] ishga tushmadi", error);
    });

  return starting;
};

/** Xatoni monitoringga uzatadi. Yoqilmagan bo'lsa — hech narsa qilmaydi. */
export const captureError = (error: Error, componentStack?: string | null) => {
  if (!DSN) return;

  if (client) {
    send({ error, componentStack });
    return;
  }

  if (pending.length < PENDING_LIMIT) pending.push({ error, componentStack });
};

/**
 * Interfeys tilini belgilaydi. Til bo'yicha farq qiladigan xatolarni
 * (masalan, faqat ruscha matn sig'may qolganda) ajratish uchun kerak.
 */
export const setMonitoringLanguage = (next: string) => {
  language = next;
  client?.setTag("language", next);
};
