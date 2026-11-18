import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import LiveChatWidget from "@/components/ui/LiveChatWidget";
import { Header } from "@/components/layout/Header";

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "Neeshanz",
    description:
      "Premium quaShop Neeshanz for trendy fashion, stylish clothing, and everyday comfort. Discover quality outfits that combine modern style, affordability, and comfort. Free delivery available.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "",
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/logo.png`,
    sameAs: [
      "https://www.facebook.com/neeshanz",
      "https://www.instagram.com/neeshanz7",
      "https://wa.me/01411788020",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+8801411788020",
      contactType: "Customer Service",
      email: "contact@neeshanz.com",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Header />
      <main>
        <HeroSection />
        <FeaturedProducts />
      </main>
      <Footer />
      <LiveChatWidget />
      <MobileNav />
    </>
  );
}
