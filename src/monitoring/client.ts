import {
  BrowserClient,
  breadcrumbsIntegration,
  captureException,
  dedupeIntegration,
  defaultStackParser,
  eventFiltersIntegration,
  functionToStringIntegration,
  getCurrentScope,
  globalHandlersIntegration,
  httpContextIntegration,
  linkedErrorsIntegration,
  makeFetchTransport,
  setTag,
} from "@sentry/browser";
import { scrubEvent } from "@/monitoring/scrub";

/** Foydalanuvchi hech qachon aybdor emas — bular brauzer shovqini */
const IGNORED = [
  // Chrome'ning zararsiz, lekin juda tez-tez uchraydigan xabari
  "ResizeObserver loop completed with undelivered notifications",
  "ResizeObserver loop limit exceeded",
  // Brauzer kengaytmalari sahifaga aralashganda
  /^chrome-extension:\/\//,
  /^moz-extension:\/\//,
];

/**
 * Mijoz `Sentry.init()` orqali emas, qo'lda yig'iladi.
 *
 * `init()` barcha standart integratsiyalarga ishora qiladi — tracing,
 * session replay, user feedback — va ular ishlatilmasa ham bundle'ga
 * tushadi. Kerakli integratsiyalarni sanab chiqish chunk'ni bir necha
 * barobar kichraytiradi; bizga faqat xato hisobotlari kerak.
 *
 * Sanab o'tilganlar:
 *   breadcrumbs      xatodan oldingi klik va so'rovlar tarixi
 *   globalHandlers   ushlanmagan xato va rad etilgan promise'lar
 *   linkedErrors     `cause` zanjiri (ApiError ichidagi asl xato)
 *   dedupe           bir xil xatoni takroran yubormaslik
 *   httpContext      brauzer va sahifa manzili
 *   eventFilters     `ignoreErrors` ro'yxati shu integratsiyada ishlaydi
 *   functionToString integratsiyalar o'ragan funksiyalar asl nomini saqlasin
 */
export const createClient = (dsn: string) => {
  const client = new BrowserClient({
    dsn,
    transport: makeFetchTransport,
    stackParser: defaultStackParser,
    environment: import.meta.env.MODE,
    // Ism, telefon va manzil — checkout formasida. Ular xato hisobotiga
    // tushishi mumkin bo'lgan yagona sabab shu bayroq.
    sendDefaultPii: false,
    ignoreErrors: IGNORED,
    beforeSend: scrubEvent,
    integrations: [
      breadcrumbsIntegration(),
      globalHandlersIntegration(),
      linkedErrorsIntegration(),
      dedupeIntegration(),
      httpContextIntegration(),
      eventFiltersIntegration(),
      functionToStringIntegration(),
    ],
  });

  getCurrentScope().setClient(client);
  client.init();

  return client;
};

export { captureException, setTag };
