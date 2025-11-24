import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default:
      "SMC Analysis - Crypto & Indian Market Trading Analysis Tool | TradeOnAir",
    template: "%s | TradeOnAir",
  },
  description:
    "Advanced SMC (Smart Money Concept) analysis tool for cryptocurrency and Indian stock market. Get AI-powered technical analysis, price action insights, trading setups, and market structure analysis for BTC, ETH, NIFTY50, BANKNIFTY and more.",
  keywords: [
    "SMC analysis",
    "Smart Money Concept",
    "crypto analysis",
    "cryptocurrency trading",
    "Indian stock market analysis",
    "technical analysis",
    "price action analysis",
    "trading setups",
    "market structure",
    "BTC analysis",
    "ETH analysis",
    "NIFTY50 analysis",
    "BANKNIFTY analysis",
    "order blocks",
    "fair value gaps",
    "liquidity zones",
    "trading signals",
    "crypto trading tool",
    "stock market analysis tool",
    "AI trading analysis",
  ],
  authors: [{ name: "TradeOnAir" }],
  creator: "TradeOnAir",
  publisher: "TradeOnAir",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://analysis.tradeonair.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://analysis.tradeonair.com",
    siteName: "TradeOnAir - SMC Analysis",
    title: "SMC Analysis - Crypto & Indian Market Trading Analysis Tool",
    description:
      "Advanced SMC (Smart Money Concept) analysis tool for cryptocurrency and Indian stock market. Get AI-powered technical analysis, price action insights, and trading setups.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TradeOnAir SMC Analysis Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SMC Analysis - Crypto & Indian Market Trading Analysis Tool",
    description:
      "Advanced SMC analysis tool for cryptocurrency and Indian stock market. Get AI-powered technical analysis and trading insights.",
    images: ["/twitter-image.png"],
    creator: "@tradeonair",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // yahoo: "your-yahoo-verification-code",
  },
  category: "Finance",
};

export default function RootLayout({ children }) {
  const structuredDataWebApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "TradeOnAir SMC Analysis Tool",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Advanced SMC (Smart Money Concept) analysis tool for cryptocurrency and Indian stock market trading. Get AI-powered technical analysis, price action insights, and trading setups.",
    url: "https://analysis.tradeonair.com",
    author: {
      "@type": "Organization",
      name: "TradeOnAir",
      url: "https://tradeonair.com",
    },
    featureList: [
      "SMC Analysis",
      "Price Action Analysis",
      "Technical Indicators",
      "Trading Setups",
      "Market Structure Analysis",
      "Multi-Timeframe Analysis",
      "Crypto Market Analysis",
      "Indian Stock Market Analysis",
    ],
  };

  const structuredDataFinancialService = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: "TradeOnAir SMC Analysis",
    description:
      "Professional trading analysis tool for cryptocurrency and Indian stock market using Smart Money Concept (SMC) methodology.",
    url: "https://analysis.tradeonair.com",
    serviceType: "Trading Analysis Tool",
    areaServed: "Worldwide",
    provider: {
      "@type": "Organization",
      name: "TradeOnAir",
    },
  };

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredDataWebApp),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredDataFinancialService),
          }}
        />
        {children}
      </body>
    </html>
  );
}
