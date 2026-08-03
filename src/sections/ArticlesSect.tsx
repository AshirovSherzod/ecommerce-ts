import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";

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
    <section className="max-w-310 mx-auto px-5 my-12 sm:my-20 flex flex-col gap-6 sm:gap-10">
      <div className="flex justify-between items-center gap-4">
        <h3 className="font-medium text-3xl sm:text-4xl">Articles</h3>
        <Button onClick={() => navigate("/blog")} variant="linked">
          More Articles
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.map((item) => (
          <div key={item.id} className="flex flex-col gap-4 sm:gap-6">
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
