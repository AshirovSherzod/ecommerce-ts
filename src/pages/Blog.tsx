import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Seo from "@/components/layout/Seo";
import { Button } from "@/components/ui/Button";
import { ARTICLES } from "@/data/articles";

export default function Blog() {
  const { t } = useTranslation("pages");
  const { t: tCommon } = useTranslation();
  const { t: tLayout } = useTranslation("layout");

  return (
    <section className="max-w-310 mx-auto px-5 my-10 flex flex-col gap-6 sm:gap-10">
      <Seo
        title={t("blog.title")}
        description={t("blog.description")}
        type="article"
      />
      <div className="flex flex-col gap-4">
        <p className="text-[14px] text-[#6C7275]">
          <Link className="hover:text-[#141718]" to={"/"}>
            {tLayout("nav.home")}
          </Link>{" "}
          &gt; <span className="text-[#141718]">{t("blog.breadcrumb")}</span>
        </p>
        <h1 className="font-medium text-[28px] sm:text-[40px]">
          {t("blog.title")}
        </h1>
        <p className="text-[#6C7275] max-w-2xl">{t("blog.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {ARTICLES.map((article) => (
          <article key={article.id} className="flex flex-col gap-4">
            <img
              className="w-full h-60 object-cover object-center"
              src={article.img}
              alt=""
              loading="lazy"
            />
            <div className="flex flex-col gap-2">
              <h2 className="font-medium text-xl">
                {t(`articles.${article.id}.title`)}
              </h2>
              <p className="text-[14px] text-[#6C7275]">
                {t(`articles.${article.id}.excerpt`)}
              </p>
              <Link to={`/blog/${article.id}`}>
                <Button variant="linked">{tCommon("actions.readMore")}</Button>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
