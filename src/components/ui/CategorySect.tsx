import livingroom from "@/assets/images/livingroom.png";
import bedroom from "@/assets/images/bedroom.png";
import kitchen from "@/assets/images/kitchen.png";
import { Button } from "@/components/ui/Button";

export default function CategorySect() {
  return (
    <section className="grid grid-cols-2 grid-rows-2 gap-6 w-full h-166">
      <div
        className="row-span-2 bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: `url(${livingroom})` }}
      >
        <h4>Living Room</h4>
        <Button>Shop Now</Button>
      </div>
      <div
        className="bg-no-repeat bg-cover bg-center w-full h-full"
        style={{ backgroundImage: `url(${bedroom})` }}
      >
        <h4>Living Room</h4>
        <Button>Shop Now</Button>
      </div>
      <div
        className="col-start-2 bg-no-repeat bg-cover bg-center w-full h-full"
        style={{ backgroundImage: `url(${kitchen})` }}
      >
        <h4>Living Room</h4>
        <Button>Shop Now</Button>
      </div>
    </section>
  );
}
