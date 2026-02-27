import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Urban Closet | Premium Clothing Ecommerce",
  description: "Shop the latest premium clothing collections at Urban Closet.",
  openGraph: {
    title: "Urban Closet | Premium Clothing Ecommerce",
    description: "Shop the latest premium clothing collections at Urban Closet.",
    type: "website",
    siteName: "Urban Closet",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${poppins.variable} antialiased min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <CartProvider>
            <Toaster position="top-center" />
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
