import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { ReactNode } from "react";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5,
			retry: 2,
			refetchOnWindowFocus: false,
		},
		mutations: {
			retry: 0,
		},
	},
});

interface QueryProviderProps {
	children: ReactNode;
}

export const QueryProvider = ({ children }: QueryProviderProps) => {
	return (
		<QueryClientProvider client={queryClient}>
			{children}
			{import.meta.env.DEV && (
				<ReactQueryDevtools
					initialIsOpen={false}
					buttonPosition="bottom-right"
				/>
			)}
		</QueryClientProvider>
	);
};
