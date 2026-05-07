import Layout from "@/components/layout/Layout";
import Contact from "@/pages/Contact";
import Home from "@/pages/Home";
import { Route, Routes } from "react-router-dom";
import Shop from "./pages/Shop";
import Blog from "./pages/Blog";
import NotFound from "./pages/NotFound";
import Cart from "@/pages/Cart";
import Wishlist from "@/pages/Wishlist";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="contact" element={<Contact />} />
          <Route path="shop" element={<Shop />} />
          <Route path="blog" element={<Blog />} />
          <Route path="cart" element={<Cart />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}
