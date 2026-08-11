import type { Metadata } from "next";
import "./globals.css";
import Nav from "../components/nav";
import Logo from "../components/logo";
import IntroLoader from "../components/intro_loader";
import { PageTransitionProvider } from "../components/page_transition";
import { ScrollContainerProvider } from "../components/scroll_container";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "../lib/site";

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
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [{ url: "/icon.png", width: 512, height: 512 }],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ["/icon.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${switzer.variable} h-full antialiased`}>
      <body className="min-h-dvh h-dvh overflow-hidden">

        <IntroLoader />

        <PageTransitionProvider>
          <Logo />
          <Nav />

          <ScrollContainerProvider className="h-full overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {children}
          </ScrollContainerProvider>
        </PageTransitionProvider>

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}