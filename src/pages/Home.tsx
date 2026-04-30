import Articles1 from "@/assets/images/articles-1.png";
import Articles2 from "@/assets/images/articles-2.png";
import Articles3 from "@/assets/images/articles-3.png";
import ArticlesSect from "@/sections/ArticlesSect";
import CategorySect from "@/sections/CategorySect";
import Hero from "@/sections/Hero";
import ServiceSect from "@/sections/ServiceSect";
import { Button } from "@/components/ui/Button";
import Banner from "@/components/ui/Banner";

const data = [
	{
		id: "1",
		img: Articles1,
		title: "7 ways to decor your home",
	},
	{
		id: "1",
		img: Articles2,
		title: "Kitchen organization",
	},
	{
		id: "1",
		img: Articles3,
		title: "Decor your bedroom",
	},
];

export default function Home() {
	return (
		<>
			<Hero />
			<CategorySect />
			<ServiceSect />
			<Banner variant="none">
				<p className="font-bold text-[#377DFF] text-[16px]">
					SALE UP TO 35% OFF
				</p>
				<h3 className="font-medium text-[40px] max-w-sm">
					HUNDREDS of New lower prices!
				</h3>
				<p className="text-xl">
					It’s more affordable than ever to give every room in your home a
					stylish makeover
				</p>
				<Button className="w-35" variant="linked">
					Show More
				</Button>
			</Banner>
			<ArticlesSect data={data} />
		</>
	);
}
