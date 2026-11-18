
import type { Metadata } from "next";
import ShopClient from "./ShopClient";

const BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://neeshanz.com"
).replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "Shop | Neeshanz",
  description:
    "Explore the latest fashion collection at Neeshanz. Discover stylish clothing, premium quality, and everyday comfort.",
  alternates: {
    canonical: `${BASE_URL}/shop`,
  },
};

export default function Page() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${BASE_URL}/#organization`,
        name: "Neeshanz",
        url: BASE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${BASE_URL}/logo.png`,
        },
        sameAs: [
          "https://www.facebook.com/neeshanz",
          "https://www.instagram.com/neeshanz7",
          "https://wa.me/8801411788020",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+8801411788020",
          contactType: "Customer Service",
          email: "contact@neeshanz.com",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${BASE_URL}/#website`,
        name: "Neeshanz",
        url: BASE_URL,
        publisher: {
          "@id": `${BASE_URL}/#organization`,
        },
      },
      {
        "@type": "CollectionPage",
        "@id": `${BASE_URL}/shop#webpage`,
        name: "Shop | Neeshanz",
        url: `${BASE_URL}/shop`,
        description:
          "Explore the latest fashion collection at Neeshanz.",
        isPartOf: {
          "@id": `${BASE_URL}/#website`,
        },
        publisher: {
          "@id": `${BASE_URL}/#organization`,
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(
            /</g,
            "\\u003c"
          ),
        }}
      />

      <ShopClient />
    </>
  );
}
