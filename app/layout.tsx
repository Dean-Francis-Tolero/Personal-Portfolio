// app/layout.tsx
import type { Metadata } from "next";
import { ViewTransition } from "react";
import "./globals.css";
import Nav from "../components/nav";
import Logo from "../components/logo";
import { ScrollContainerProvider } from "../components/scroll_container";
import localFont from "next/font/local";

const switzer = localFont({
  src: [
    { path: "./fonts/Switzer-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Switzer-Italic.woff2", weight: "400", style: "italic" },
    { path: "./fonts/Switzer-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Switzer-MediumItalic.woff2", weight: "500", style: "italic" },
    { path: "./fonts/Switzer-Semibold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/Switzer-SemiboldItalic.woff2", weight: "600", style: "italic" },
    { path: "./fonts/Switzer-Bold.woff2", weight: "700", style: "normal" },
    { path: "./fonts/Switzer-BoldItalic.woff2", weight: "700", style: "italic" },
  ],
  variable: "--font-switzer",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dean Francis Tolero",
  description: "Personal website of Dean Francis Tolero",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${switzer.variable} h-full antialiased`}>
      <body className="min-h-screen h-screen overflow-hidden">
        
        <Logo />
        <Nav />

        <ScrollContainerProvider className="h-full overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <ViewTransition update="page-crossfade">
            {children}
          </ViewTransition>
        </ScrollContainerProvider>

      </body>
    </html>
  );
}