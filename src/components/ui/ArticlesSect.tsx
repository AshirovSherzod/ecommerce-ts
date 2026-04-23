import { useNavigate } from "react-router-dom";
import { Button } from "./Button";

type Data = {
	id: string;
	img: string;
	title: string;
};

type ArticlesSectProps = {
	data: Data[];
};

export default function ArticlesSect({ data }: ArticlesSectProps) {
	const navigate = useNavigate();

	return (
		<section className="container mx-auto px-5 my-20 flex flex-col gap-10">
			<div className="flex justify-between items-center">
				<h3 className="font-medium text-4xl">Articles</h3>
				<Button onClick={() => navigate("/blog")} variant="linked">
					More Articles
				</Button>
			</div>
			<div className="flex justify-between gap-6">
				{data?.map((item) => (
					<div
						key={item.id}
						style={{ width: "calc(100% / 3)" }}
						className="flex flex-col gap-6"
					>
						<img className="w-full" src={item.img} alt="" />
						<div className="">
							<h4 className="font-medium text-xl">{item.title}</h4>
							<Button variant="linked">Read More</Button>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
