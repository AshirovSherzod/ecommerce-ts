import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import GuestOnly from "@/components/layout/GuestOnly";
import Layout from "@/components/layout/Layout";
import PageLoader from "@/components/layout/PageLoader";
import ScrollToTop from "@/components/layout/ScrollToTop";

// Har bir marshrut alohida chunk: boshlang'ich yuklamada faqat ochilgan
// sahifaning kodi keladi. Suspense zaxira ekrani Layout ichida —
// header va footer darhol chiziladi.
const Home = lazy(() => import("@/pages/Home"));
const Shop = lazy(() => import("@/pages/Shop"));
const Product = lazy(() => import("@/pages/Product"));
const Blog = lazy(() => import("@/pages/Blog"));
const Contact = lazy(() => import("@/pages/Contact"));
const Cart = lazy(() => import("@/pages/Cart"));
const Checkout = lazy(() => import("@/pages/Checkout"));
const Wishlist = lazy(() => import("@/pages/Wishlist"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const SignIn = lazy(() => import("@/pages/SignIn"));
const SignUp = lazy(() => import("@/pages/SignUp"));

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Auth sahifalari Layout'dan tashqarida: dizaynda header va footer
            yo'q, ekranni to'liq egallaydi */}
        <Route
          path="/signin"
          element={
            <GuestOnly>
              <Suspense fallback={<PageLoader />}>
                <SignIn />
              </Suspense>
            </GuestOnly>
          }
        />
        <Route
          path="/signup"
          element={
            <GuestOnly>
              <Suspense fallback={<PageLoader />}>
                <SignUp />
              </Suspense>
            </GuestOnly>
          }
        />

        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="contact" element={<Contact />} />
          <Route path="shop" element={<Shop />} />
          <Route path="shop/:id" element={<Product />} />
          <Route path="blog" element={<Blog />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="light"
        newestOnTop
      />
    </>
  );
}
