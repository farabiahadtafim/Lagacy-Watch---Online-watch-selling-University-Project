import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import AppWrapper from "@/lib/AppWrapper";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Legacy Watches | Premium Timepieces",
  description: "Discover the finest collection of luxury watches at Legacy Watches. Quality craftsmanship and timeless design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link rel="icon" href="/product-images/homepage/section 1/LEGACY ICON.svg" type="image/svg+xml" />
      </head>
      <body className="antialiased">
        <AppWrapper>
          <Toaster position="top-center" />
          {children}
        </AppWrapper>
      </body>
    </html>
  );
}
