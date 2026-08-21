import { useTranslation } from "react-i18next";

const SITE_NAME = "3legant";



interface SeoProps {
  /** Sahifa nomi. Sayt nomi avtomatik qo'shiladi. */
  title: string;
  description?: string;
  /** Ijtimoiy tarmoqlarda ulashilganda ko'rinadigan rasm (to'liq URL) */
  image?: string;
  type?: "website" | "article" | "product";
  /** Savat, wishlist va 404 kabi sahifalar qidiruvga tushmasligi kerak */
  noIndex?: boolean;
}

/**
 * React 19 `<title>` va `<meta>` teglarini daraxtning istalgan joyidan
 * `<head>` ga ko'chiradi, shuning uchun react-helmet kabi kutubxona kerak
 * emas — sahifa komponenti o'z metama'lumotini o'zi e'lon qiladi.
 */
export default function Seo({
  title,
  description,
  image,
  type = "website",
  noIndex = false,
}: SeoProps) {
  const { t, i18n } = useTranslation("pages");

  const fullTitle = title === SITE_NAME ? title : `${title} — ${SITE_NAME}`;
  const text = description ?? t("home.description");

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={text} />
      {/* Ulashilganda ijtimoiy tarmoq sarlavhani qaysi tilda ekanini bilsin */}
      <meta property="og:locale" content={i18n.language} />

      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={text} />
      {image && <meta property="og:image" content={image} />}

      <meta
        name="twitter:card"
        content={image ? "summary_large_image" : "summary"}
      />
    </>
  );
}
