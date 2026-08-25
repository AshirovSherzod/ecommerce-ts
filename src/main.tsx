import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
// Tarjimalar ilova chizilishidan oldin tayyor bo'lishi kerak
import "@/i18n";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { QueryProvider } from "@/provider/QueryProvider.tsx";
import ErrorBoundary from "@/components/layout/ErrorBoundary";
import { initMonitoring } from "@/monitoring";

// Chizishdan oldin: birinchi renderdagi qulash ham hisobotga tushsin.
// `void` — natijani kutmaymiz, Sentry fonda yuklanadi va shu orada
// yuz bergan xatolar navbatda saqlanadi.
void initMonitoring();

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			{/* Ildiz boundary: Header, Footer yoki Layout'ning o'zi qulaganda
			    ishlaydi. Router ichida turibdi, shuning uchun zaxira ekrandagi
			    havolalar ham ishlaydi. */}
			<ErrorBoundary fullPage>
				<QueryProvider>
					<App />
				</QueryProvider>
			</ErrorBoundary>
		</BrowserRouter>
	</StrictMode>,
);
