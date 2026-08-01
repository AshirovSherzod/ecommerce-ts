import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import { Button } from "@/components/ui/Button";
import Counter from "@/components/ui/Counter";
import Empty from "@/components/ui/Empty";
import { useCartStore } from "@/store";
import type { CartItem } from "@/types/cart.types";
import { formatPrice } from "@/utils/formatPrice";
import { PRODUCT_PLACEHOLDER } from "@/utils/constants";
import emptyImg from "@/assets/icons/empty.webp";

const SHIPPING_OPTIONS = [
  { id: "free", label: "Free shipping", price: 0 },
  { id: "express", label: "Express shipping", price: 15 },
  { id: "pickup", label: "Pick Up", price: 21 },
] as const;

type ShippingId = (typeof SHIPPING_OPTIONS)[number]["id"];

const STEPS = ["Shopping cart", "Checkout details", "Order complete"];

// ─── Bitta qator ────────────────────────────────────
interface CartRowProps {
  item: CartItem;
}

function CartRow({ item }: CartRowProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  // Counter useState setter'ini kutadi, bizda esa quantity store'da turadi
  const setQuantity: React.Dispatch<React.SetStateAction<number>> = (value) => {
    const next = typeof value === "function" ? value(item.quantity) : value;
    updateQuantity(item.id, next);
  };

  return (
    <div className="grid grid-cols-[1fr_auto] md:grid-cols-[2fr_1fr_1fr_1fr] items-center gap-4 py-6 border-b border-[#E8ECEF]">
      <div className="flex gap-4 items-center">
        <img
          className="w-20 h-25 object-contain object-center bg-[#F3F5F7] rounded-md shrink-0"
          src={item.images?.[0] || PRODUCT_PLACEHOLDER}
          alt={item.title}
          loading="lazy"
        />
        <div className="flex flex-col gap-1 min-w-0">
          <h4 className="font-semibold truncate">{item.title}</h4>
          <p className="text-[14px] text-[#6C7275] truncate">{item.brand}</p>
          <button
            type="button"
            onClick={() => removeItem(item.id)}
            className="flex items-center gap-1 text-[14px] text-[#6C7275] hover:text-[#141718] w-fit"
          >
            <IoClose /> Remove
          </button>
          <p className="font-semibold md:hidden">
            {formatPrice(item.price, item.currency)}
          </p>
        </div>
      </div>

      <div className="justify-self-end md:justify-self-center">
        <Counter
          variant="secondary"
          counter={item.quantity}
          setCounter={setQuantity}
          min={1}
        />
      </div>

      <p className="hidden md:block text-center">
        {formatPrice(item.price, item.currency)}
      </p>
      <p className="hidden md:block text-right font-semibold">
        {formatPrice(item.price * item.quantity, item.currency)}
      </p>

      <p className="md:hidden col-span-2 text-right font-semibold">
        {formatPrice(item.price * item.quantity, item.currency)}
      </p>
    </div>
  );
}

// ─── Sahifa ────────────────────────────────────
export default function Cart() {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const [shippingId, setShippingId] = useState<ShippingId>("free");

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items],
  );

  const shipping =
    SHIPPING_OPTIONS.find((option) => option.id === shippingId) ??
    SHIPPING_OPTIONS[0];

  // Savatdagi mahsulotlarning valyutasi (aralash bo'lsa birinchisi olinadi)
  const currency = items[0]?.currency ?? "USD";
  const total = subtotal + shipping.price;

  const handleCheckout = () => {
    toast.info("Checkout tez orada qo'shiladi", {
      position: "top-right",
      autoClose: 3000,
      theme: "light",
    });
  };

  if (items.length === 0) {
    return (
      <section style={{ minHeight: "calc(100vh - 200px)" }}>
        <Empty
          title="Cart is empty"
          desc="Looks like you haven't added anything yet"
          image={emptyImg}
        />
      </section>
    );
  }

  return (
    <section className="max-w-310 mx-auto px-5 my-10 flex flex-col gap-10">
      <div className="flex flex-col items-center gap-6">
        <p className="text-[14px] text-[#6C7275]">
          <Link className="hover:text-[#141718]" to={"/"}>
            Home
          </Link>{" "}
          &gt; <span className="text-[#141718]">Cart</span>
        </p>
        <h2 className="font-medium text-[40px]">Cart</h2>

        <ol className="flex flex-wrap justify-center gap-4 sm:gap-10">
          {STEPS.map((step, index) => (
            <li
              key={step}
              className={`flex items-center gap-2 text-[14px] sm:text-base ${
                index === 0 ? "text-[#141718] font-medium" : "text-[#6C7275]"
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] ${
                  index === 0
                    ? "bg-[#141718] text-white"
                    : "bg-[#F3F5F7] text-[#6C7275]"
                }`}
              >
                {index + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 items-start">
        <div className="w-full lg:w-[65%]">
          <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 pb-3 border-b border-[#141718] text-[14px] font-medium text-[#6C7275]">
            <span>PRODUCT</span>
            <span className="text-center">QUANTITY</span>
            <span className="text-center">PRICE</span>
            <span className="text-right">SUBTOTAL</span>
          </div>

          {items.map((item) => (
            <CartRow key={item.id} item={item} />
          ))}

          <div className="flex justify-between items-center pt-6">
            <Link
              className="text-[14px] text-[#6C7275] hover:text-[#141718] border-b"
              to={"/shop"}
            >
              Continue shopping
            </Link>
            <button
              type="button"
              onClick={clearCart}
              className="text-[14px] text-[#6C7275] hover:text-[#141718] border-b"
            >
              Clear cart
            </button>
          </div>
        </div>

        <div className="w-full lg:w-[35%] border border-[#6C7275] rounded-md p-6 flex flex-col gap-6">
          <h3 className="font-medium text-xl">Cart summary</h3>

          <div className="flex flex-col gap-3">
            {SHIPPING_OPTIONS.map((option) => (
              <label
                key={option.id}
                className={`flex items-center justify-between px-4 py-3 rounded-md cursor-pointer border ${
                  shippingId === option.id
                    ? "border-[#141718] bg-[#F3F5F7]"
                    : "border-[#E8ECEF]"
                }`}
              >
                <span className="flex items-center gap-3 text-[14px]">
                  <input
                    className="accent-[#141718]"
                    type="radio"
                    name="shipping"
                    value={option.id}
                    checked={shippingId === option.id}
                    onChange={() => setShippingId(option.id)}
                  />
                  {option.label}
                </span>
                <span className="text-[14px] font-medium">
                  {formatPrice(option.price, currency)}
                </span>
              </label>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center pb-3 border-b border-[#E8ECEF]">
              <span className="text-[#6C7275]">Subtotal</span>
              <span className="font-semibold">
                {formatPrice(subtotal, currency)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-xl">Total</span>
              <span className="font-semibold text-xl">
                {formatPrice(total, currency)}
              </span>
            </div>
          </div>

          <Button onClick={handleCheckout} className="w-full">
            Checkout
          </Button>
        </div>
      </div>
    </section>
  );
}
