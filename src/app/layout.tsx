import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/layout/Footer";
import { ViewportScrollReset } from "@/components/layout/ViewportScrollReset";
import { Providers } from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ourlist",
  description: "Manage your shopping list efficiently.",
  icons: {
    icon: "/favicon.ico?v=2",
    shortcut: "/favicon.ico?v=2",
  },
};

export const viewport: Viewport = {
  interactiveWidget: "resizes-content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full overflow-hidden antialiased`}
    >
      <body className="h-[var(--app-height,100dvh)] flex flex-col overflow-hidden">
        <Providers>
          <ViewportScrollReset />
          <NavBar />
          <main className="flex-1 bg-gray-100 min-h-0 overflow-hidden">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
