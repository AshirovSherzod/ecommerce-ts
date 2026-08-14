import { useNavigate } from "react-router-dom";
import Seo from "@/components/layout/Seo";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <section
      style={{ minHeight: "calc(100vh - 200px)" }}
      className="px-5 flex flex-col items-center justify-center gap-4 text-center"
    >
      <Seo
        title="Page not found"
        description="The page you are looking for was moved or never existed."
        noIndex
      />
      <p className="font-medium text-[64px]/[64px] text-[#E8ECEF]">404</p>
      <h1 className="font-medium text-[28px] sm:text-[40px]">Page not found</h1>
      <p className="text-[#6C7275] max-w-md">
        The page you are looking for was moved or never existed.
      </p>
      <div className="flex flex-wrap justify-center gap-3 pt-2">
        <Button onClick={() => navigate("/")}>Go To Home</Button>
        <Button variant="secondary" onClick={() => navigate("/shop")}>
          Go To Shop
        </Button>
      </div>
    </section>
  );
}
