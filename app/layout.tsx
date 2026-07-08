import type { Metadata } from "next";
import "./globals.css";
import Nav from '@/app/nav';
import { Inter } from "next/font/google";
import { Manrope } from "next/font/google";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400","700"]
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
      className={`${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Nav />
      {children}</body>

    </html>
  );
};
