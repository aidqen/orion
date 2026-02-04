"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { AuthPopup } from "@/components/auth/AuthPopup";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DataStreamProvider } from "@/contexts/DataStreamContext";
import { UserProvider } from "@/contexts/UserContext";
import { Sidebar } from "../components/Sidebar/Sidebar";
import { Toaster } from "../components/ui/sonner";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5, // 5 minutes
			refetchOnWindowFocus: false,
		},
	},
});

export function Providers({ children }: { children: ReactNode }) {
	return (
		<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
			<QueryClientProvider client={queryClient}>
				<DataStreamProvider>
					<UserProvider>
						<SidebarProvider>
							<Toaster position="bottom-right" />
							<Sidebar />
							<AuthPopup />
							{children}
						</SidebarProvider>
					</UserProvider>
				</DataStreamProvider>
			</QueryClientProvider>
		</ThemeProvider>
	);
}
