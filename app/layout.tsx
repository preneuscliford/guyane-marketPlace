import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/providers/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Guyane Marketplace",
  description: "La place de marché de la Guyane",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="h-full">
      <body
        className={`${inter.className} min-h-screen bg-gradient-to-b from-slate-50 to-white`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
