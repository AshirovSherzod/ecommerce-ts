type ProductType = {
  image: string;
  rate: number;
  title: string;
  price: string;
  oldPrice: string;
};

type ProductCardProps = {
  product: ProductType;
};
export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className={`w-90`}>
      <div className="w-full">
        <img
          className="w-full bg-white h-48 object-contain"
          src={product.image}
          alt={product.title}
        />
      </div>
      <div className="">
        <p>{product.rate}</p>
        <h3>{product.title}</h3>
        <p>
          {product.price} <span>${product.oldPrice}</span>
        </p>
      </div>
    </div>
  );
}
