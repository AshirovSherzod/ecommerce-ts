import { Suspense } from "react";
import ErrorBoundary from "@/components/layout/ErrorBoundary";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import PageLoader from "@/components/layout/PageLoader";

import { Outlet, useLocation } from "react-router-dom";

export default function Layout() {
	const { pathname } = useLocation();

	return (
		<>
			<Header />
			<main>
				{/* Sahifa darajasidagi boundary: bitta sahifa qulasa ham header
				    va footer joyida qoladi, foydalanuvchi boshqa bo'limga o'ta
				    oladi. `resetKey` marshrutga bog'langani uchun boshqa
				    sahifaga o'tish boundary'ni avtomatik tiklaydi. */}
				<ErrorBoundary resetKey={pathname}>
					{/* Chunk yuklanmay qolsa (masalan deploy paytida eski fayl
					    yo'qolsa) xatoni yuqoridagi boundary ushlaydi */}
					<Suspense fallback={<PageLoader />}>
						<Outlet />
					</Suspense>
				</ErrorBoundary>
			</main>
			<Footer />
		</>
	);
}
