import ContactHero from "@/sections/ContactHero";
import Banner from "@/components/ui/Banner";
import { Button } from "@/components/ui/Button";

export default function Contact() {
  return (
    <>
      <ContactHero />
      <Banner variant="containered">
        <h3 className="font-medium text-[40px] max-w-sm">About Us</h3>
        <p className="text-xl">
          3legant is a gift & decorations store based in HCMC, Vietnam. Est
          since 2019. Our customer service is always prepared to support you
          24/7
        </p>
        <Button className="w-35" variant="linked">
          Show More
        </Button>
      </Banner>
    </>
  );
}
