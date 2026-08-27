import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

type Data = {
  id: string;
  img: string;
};

type ArticlesSectProps = {
  data: Data[];
};

export default function ArticlesSect({ data }: ArticlesSectProps) {
  const { t } = useTranslation("pages");
  const { t: tCommon } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="max-w-310 mx-auto px-5 my-12 sm:my-20 flex flex-col gap-6 sm:gap-10">
      <div className="flex justify-between items-center gap-4">
        <h3 className="font-medium text-3xl sm:text-4xl">
          {t("home.articles.title")}
        </h3>
        <Button onClick={() => navigate("/blog")} variant="linked">
          {t("home.articles.more")}
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.map((item) => (
          <div key={item.id} className="flex flex-col gap-4 sm:gap-6">
            <img className="w-full" src={item.img} alt="" />
            <div className="">
              <h4 className="font-medium text-xl">
                {t(`articles.${item.id}.title`)}
              </h4>
              <Link to={`/blog/${item.id}`}>
                <Button variant="linked">{tCommon("actions.readMore")}</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
