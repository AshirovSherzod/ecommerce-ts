import Seo from "@/components/layout/Seo";
import ContactHero from "@/sections/ContactHero";
import Banner from "@/components/ui/Banner";
import { Button } from "@/components/ui/Button";
import ContactForm from "@/sections/ContactForm";
import ContactSect from "@/sections/ContactSect";

export default function Contact() {
  return (
    <>
      <Seo
        title="Contact Us"
        description="Get in touch with 3legant — 234 Hai Trieu, Ho Chi Minh City. Phone +84 234 567 890, hello@3legant.com. Support 24/7."
      />
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
      <ContactSect />
      <ContactForm />
    </>
  );
}
