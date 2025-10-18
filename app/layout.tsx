import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { generateGuyaneSEO, SEO_TEMPLATES } from "@/lib/seo";
import GoogleTagManager, {
  GoogleTagManagerNoScript,
} from "@/components/analytics/GoogleTagManager";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";

import { Footer } from "@/components/layout/Footer";
import { MVPBanner } from "@/components/layout/MVPBanner";
import { DynamicPadding } from "@/components/layout/DynamicPadding";
import PWAManager from "@/components/PWAManager";
import PWAStyles from "@/components/PWAStyles";
import { Toaster } from "sonner";
import { HeaderWrapper } from "./components/layout/HeaderWrapper";
import AuthProviderWrapper from "./components/providers/AuthProviderWrapper";
import { MVPBannerProvider } from "./components/providers/MVPBannerProvider";
import { QueryProvider } from "./providers/QueryProvider";
import FeedbackButton from "./components/feedback/FeedbackButton";
import AuthURLCleaner from "./components/auth/AuthURLCleaner";

const inter = Inter({ subsets: ["latin"] });

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  ...generateGuyaneSEO({
    ...SEO_TEMPLATES.home,
    canonicalUrl: "/",
  }),
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Guyane Market",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html lang="fr" className="h-full">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#667eea" />

        {/* Schema.org structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "MCGuyane",
              alternateName: "Marketplace Guyane",
              url: "https://www.mcguyane.com",
              logo: "https://www.mcguyane.com/icon.svg",
              description:
                "Première plateforme de services, produits et annonces en Guyane française",
              address: {
                "@type": "PostalAddress",
                addressRegion: "Guyane française",
                addressCountry: "GF",
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+33-7-58-08-05-70",
                contactType: "customer service",
                availableLanguage: ["French"],
              },
              sameAs: [
                "https://github.com/preneuscliford",
                "https://www.linkedin.com/in/preneus-cliford/",
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "MCGuyane",
              url: "https://www.mcguyane.com",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate:
                    "https://www.mcguyane.com/services?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${inter.className} min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col pt-28 sm:pt-32`}
      >
        {/* Google Tag Manager (noscript) - doit être au début du body */}
        {gtmId && <GoogleTagManagerNoScript gtmId={gtmId} />}

        {/* Google Tag Manager Script */}
        {gtmId && <GoogleTagManager gtmId={gtmId} />}

        {/* Google Analytics */}
        <GoogleAnalytics />

        <QueryProvider>
          <AuthProviderWrapper>
            <MVPBannerProvider>
              <PWAStyles />
              <AuthURLCleaner />
              <DynamicPadding />
              <MVPBanner />
              <HeaderWrapper />
              <div className="flex-1 flex flex-col">{children}</div>
              <Footer />
              <FeedbackButton />
              <PWAManager />
              <Toaster
                position="top-right"
                toastOptions={{
                  style: {
                    background: "white",
                    border: "1px solid #e2e8f0",
                    color: "#1e293b",
                  },
                }}
              />
            </MVPBannerProvider>
          </AuthProviderWrapper>
        </QueryProvider>
      </body>
    </html>
  );
}
