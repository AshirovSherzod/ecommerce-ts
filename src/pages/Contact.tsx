import { Button } from "@/components/ui/Button";
import ContactHero from "@/components/ui/ContactHero";
import SaleUpSect from "@/components/ui/SaleUpSect";

export default function Contact() {
	return (
		<>
			<ContactHero />
			<SaleUpSect>
				<h3 className="font-medium text-[40px] max-w-sm">About Us</h3>
				<p className="text-xl">
					3legant is a gift & decorations store based in HCMC, Vietnam. Est
					since 2019. Our customer service is always prepared to support you
					24/7
				</p>
				<Button className="w-35" variant="linked">
					Show More
				</Button>
			</SaleUpSect>
		</>
	);
}
