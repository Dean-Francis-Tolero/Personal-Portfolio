import type { Metadata } from "next";
import "./globals.css";
import Nav from '@/app/nav';
import { Inter } from "next/font/google";

const inter = Inter({
  variable: "--font--inter",
  subsets: ["latin"],
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
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <Nav></Nav>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
