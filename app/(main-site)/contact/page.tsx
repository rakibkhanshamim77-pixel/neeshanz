import type { Metadata } from "next";

import { ContactFormSection } from "./ContactFormSection";
import { ContactInfoSection } from "./ContactInfoSection";

const BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://neeshanz.com"
).replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "Contact | Neeshanz",
  description:
    "Contact Neeshanz support for order inquiries, sizing help, delivery information, and general questions.",
  alternates: {
    canonical: `${BASE_URL}/contact`,
  },
};

export default function ContactPage() {
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
        "@type": "ContactPage",
        "@id": `${BASE_URL}/contact#webpage`,
        name: "Contact | Neeshanz",
        url: `${BASE_URL}/contact`,
        description:
          "Contact Neeshanz support for order inquiries, sizing help, delivery information, and general questions.",
        isPartOf: {
          "@id": `${BASE_URL}/#website`,
        },
        publisher: {
          "@id": `${BASE_URL}/#organization`,
        },
        mainEntity: {
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
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />

      <main className="min-h-[60vh] pb-24 lg:pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <header className="mb-8 lg:mb-10">
            <p className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/15 px-4 py-1 text-xs font-medium uppercase tracking-widest text-black/60 dark:text-white/60">
              Support &amp; contact
            </p>

            <h1 className="mt-4 text-3xl lg:text-4xl font-bold text-black dark:text-white font-bengali">
              আমাদের সাথে যোগাযোগ করুন
            </h1>

            <p className="mt-2 text-sm lg:text-base text-black/60 dark:text-white/70 font-bengali max-w-2xl">
              অর্ডার, সাইজ বা ডেলিভারি নিয়ে যেকোনো প্রশ্ন থাকলে আমাদের লিখুন।
              আমরা যত দ্রুত সম্ভব উত্তর দেওয়ার চেষ্টা করি।
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-8 lg:gap-10 items-start">
            <ContactFormSection />
            <ContactInfoSection />
          </div>
        </div>
      </main>
    </>
  );
}
