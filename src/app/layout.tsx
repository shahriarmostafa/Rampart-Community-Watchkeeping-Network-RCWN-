import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/features/auth/authProvider";
import { PwaServiceWorkerRegister } from "@/components/public/pwaServiceWorkerRegister";
import "./globals.css";
import "@/styles/main.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "RCWN",
  description: "Rampart Community Watchkeeping Network",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#0f766e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`} suppressHydrationWarning>
        <PwaServiceWorkerRegister />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
