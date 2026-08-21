import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface EmptyProps {
  image: string;
  title: string;
  desc: string;
}

export default function Empty({ image, title, desc }: EmptyProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section
      style={{ minHeight: "calc(100% - 100px)" }}
      className="mt-15 px-5 flex flex-col items-center justify-center gap-2 text-center"
    >
      <img className="w-40 sm:w-1/6" src={image} alt="" />
      <h3 className="font-medium text-xl">{title}</h3>
      <p className="text-[#6C7275]">{desc}</p>
      <Button onClick={() => navigate("/")}>{t("actions.goHome")}</Button>
    </section>
  );
}
