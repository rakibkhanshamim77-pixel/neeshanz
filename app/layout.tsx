import type { Metadata } from "next";
import { SUSE, Noto_Sans_Bengali } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = SUSE({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-bengali",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "Neeshanz - Fashion & Compfort",
    template: "Neeshanz - %s",
  },
  description:
    "Shop Neeshanz for trendy fashion, stylish clothing, and everyday comfort. Discover quality outfits that combine modern style, affordability, and comfort. Free delivery available.",
  keywords: [
    "Online Shopping Bangladesh",
    "Fashion Store Bangladesh",
    "Online Clothing Shop Bangladesh",
    "Best Online Fashion Store in Bangladesh",
    "Men's Clothing Bangladesh",
    "Women's Clothing Bangladesh",
    "Trendy Clothes in Bangladesh",
    "Affordable Clothing Bangladesh",
    "Online Dress Shopping Bangladesh",
  ],
  authors: [{ name: "Md Shamim Mia" }],
  creator: "Md Shamim Mia",
  publisher: "Neeshanz",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || ""),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "bn_BD",
    url: "/",
    siteName: "Neeshanz",
    title: "Neeshanz - Fashion & Comfort",
    description:
      "Shop Neeshanz for trendy fashion, stylish clothing, and everyday comfort. Discover quality outfits that combine modern style, affordability, and comfort. Free delivery available.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Neeshanz - Next Level Tees",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Neeshanz - Next Level Tees",
    description: "Premium quality t-shirts with modern designs.",
    images: ["/og-image.png"],
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
    // Add your verification codes here
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme')||(window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');document.documentElement.classList.toggle('dark',t==='dark');})();`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${inter.variable} ${notoSansBengali.variable} antialiased bg-white dark:bg-black text-black dark:text-white min-h-screen transition-colors duration-300`}
        style={{
          fontFamily: "var(--font-inter), var(--font-bengali), sans-serif",
        }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
