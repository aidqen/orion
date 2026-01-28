import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { HomepageHeader } from "@/components/HomepageHeader";
import { SidebarTrigger } from "@/components/ui/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Planwise",
  description: "Plan your life with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-[#111827]  dark:text-[#E5E7EB]`}
      >
        <Providers>
          <main className="relative flex h-dvh w-dvw flex-1 flex-col">
          <SidebarTrigger className="fixed md:hidden block top-4 left-4 z-10" />
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
