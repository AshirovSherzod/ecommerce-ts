import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Seo from "@/components/layout/Seo";
import { Button } from "@/components/ui/Button";
import { ARTICLES } from "@/data/articles";
import { ARTICLE_BODIES } from "@/data/articleBodies";
import { DEFAULT_LANGUAGE, isLanguageCode } from "@/i18n/config";

export default function Article() {
  const { id = "" } = useParams();
  const { t, i18n } = useTranslation("pages");
  const { t: tLayout } = useTranslation("layout");

  const article = ARTICLES.find((item) => item.id === id);

  // Til kodi noma'lum bo'lsa (masalan qo'lda o'zgartirilgan) standart tilga
  const language = isLanguageCode(i18n.language)
    ? i18n.language
    : DEFAULT_LANGUAGE;
  const paragraphs = ARTICLE_BODIES[language][id];

  if (!article || !paragraphs) {
    return (
      <section
        style={{ minHeight: "calc(100vh - 200px)" }}
        className="px-5 flex flex-col items-center justify-center gap-4 text-center"
      >
        <Seo title={t("article.notFound")} noIndex />
        <h1 className="font-medium text-2xl">{t("article.notFound")}</h1>
        <p className="text-[#6C7275]">{t("article.notFoundDesc")}</p>
        <Link to="/blog">
          <Button>{t("article.backToBlog")}</Button>
        </Link>
      </section>
    );
  }

  const title = t(`articles.${id}.title`);
  const others = ARTICLES.filter((item) => item.id !== id);

  return (
    <article className="max-w-3xl mx-auto px-5 my-10 flex flex-col gap-8">
      <Seo
        title={title}
        description={t(`articles.${id}.excerpt`)}
        image={article.img}
        type="article"
      />

      <div className="flex flex-col gap-4">
        <p className="text-[14px] text-[#6C7275]">
          <Link className="hover:text-[#141718]" to="/">
            {tLayout("nav.home")}
          </Link>{" "}
          &gt;{" "}
          <Link className="hover:text-[#141718]" to="/blog">
            {t("blog.breadcrumb")}
          </Link>
        </p>

        <h1 className="font-medium text-[28px]/[36px] sm:text-[40px]/[48px]">
          {title}
        </h1>
        <p className="text-lg text-[#6C7275]">{t(`articles.${id}.excerpt`)}</p>
      </div>

      <img
        className="w-full h-60 sm:h-96 object-cover object-center rounded-lg"
        src={article.img}
        alt=""
      />

      {/* O'qish qulay bo'lishi uchun qator uzunligi cheklangan */}
      <div className="flex flex-col gap-5 text-[17px]/[30px] text-[#353945]">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      {/* Matn namunaviy ekani yashirilmaydi — do'kon uni almashtirmaguncha
          o'quvchi buni bilib turgani halolroq */}
      <p className="text-[13px] text-[#6C7275] border-t border-[#E8ECEF] pt-4">
        {t("article.placeholder")}
      </p>

      <div className="flex flex-col gap-4 border-t border-[#E8ECEF] pt-8">
        <h2 className="font-medium text-xl">{t("article.more")}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {others.map((item) => (
            <Link
              key={item.id}
              to={`/blog/${item.id}`}
              className="flex flex-col gap-3 group"
            >
              <img
                className="w-full h-40 object-cover object-center rounded-md"
                src={item.img}
                alt=""
                loading="lazy"
              />
              <h3 className="font-medium group-hover:underline">
                {t(`articles.${item.id}.title`)}
              </h3>
            </Link>
          ))}
        </div>

        <Link to="/blog" className="w-full sm:w-48">
          <Button variant="secondary" className="w-full">
            {t("article.backToBlog")}
          </Button>
        </Link>
      </div>
    </article>
  );
}
