import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
;

import { Footer } from "@/components/layout/Footer";
import PWAManager from "@/components/PWAManager";
import { Toaster } from "sonner";
import { HeaderWrapper } from "./components/layout/HeaderWrapper";
import AuthProviderWrapper from "./components/providers/AuthProviderWrapper";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Guyane Marketplace - La marketplace guyanaise",
  description: "La place de marché communautaire de la Guyane française. Achetez et vendez localement avec un système publicitaire innovant.",
  keywords: "marketplace, guyane, française, annonces, publicités, local, commerce",
  authors: [{ name: "Guyane Marketplace" }],
  creator: "Guyane Marketplace",
  publisher: "Guyane Marketplace",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Guyane Marketplace",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://guyane-marketplace.com",
    title: "Guyane Marketplace - La marketplace guyanaise",
    description: "La place de marché communautaire de la Guyane française",
    siteName: "Guyane Marketplace",
  },
  twitter: {
    card: "summary_large_image",
    title: "Guyane Marketplace - La marketplace guyanaise",
    description: "La place de marché communautaire de la Guyane française",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: "#667eea",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Guyane Marketplace",
    "application-name": "Guyane Marketplace",
    "msapplication-TileColor": "#667eea",
    "msapplication-config": "/browserconfig.xml",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="h-full">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#667eea" />
      </head>
      <body className={`${inter.className} min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col pt-16`}>
        <AuthProviderWrapper>
          <HeaderWrapper />
          <div className="flex-1 flex flex-col">
            {children}
          </div>
          <Footer />
          <PWAManager />
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: 'white',
                border: '1px solid #e2e8f0',
                color: '#1e293b',
              },
            }}
          />
        </AuthProviderWrapper>
      </body>
    </html>
  );
}