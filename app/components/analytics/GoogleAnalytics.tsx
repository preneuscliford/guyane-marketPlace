"use client";

import Script from "next/script";

interface GoogleAnalyticsProps {
  measurementId?: string;
}

export default function GoogleAnalytics({
  measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-S651THS9H0",
}: GoogleAnalyticsProps) {
  // Ne pas charger en développement pour éviter de polluer les données
  if (process.env.NODE_ENV === "development") {
    return null;
  }

  if (!measurementId) {
    console.warn("Google Analytics: Measurement ID not provided");
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            page_location: window.location.href,
            page_title: document.title,
            send_page_view: true
          });
        `}
      </Script>
    </>
  );
}
