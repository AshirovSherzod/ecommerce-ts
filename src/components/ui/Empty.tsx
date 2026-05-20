import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";

interface EmptyProps {
  image: string;
  title: string;
  desc: string;
}

export default function Empty({ image, title, desc }: EmptyProps) {
  const navigate = useNavigate();

  return (
    <section
      style={{ minHeight: "calc(100% - 100px)" }}
      className="mt-15 flex flex-col items-center justify-center gap-2"
    >
      <img className="w-1/6" src={image} alt="" />
      <h3>{title}</h3>
      <p>{desc}</p>
      <Button onClick={() => navigate("/")}>Go To Home</Button>
    </section>
  );
}
