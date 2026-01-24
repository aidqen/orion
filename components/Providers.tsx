"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UserProvider } from "@/contexts/UserContext";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthPopup } from "@/components/auth/AuthPopup";
import { Sidebar } from "./sidebar/Sidebar";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
})


export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <SidebarProvider>
            <Sidebar />
            {children}
            <AuthPopup />
          </SidebarProvider>
        </UserProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

