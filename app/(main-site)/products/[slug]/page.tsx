import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProductDetailClient from "./ProductDetailClient";
import { getProductBySlug } from "./getProduct";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://neeshanz.com"
).replace(/\/+$/, "");

const SITE_NAME = "Neeshanz";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

function cleanDescription(value?: string | null): string {
  return (value || "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);
}

// Only JSON-LD images need absolute URLs
function getAbsoluteImageUrl(image?: string | null): string | undefined {
  if (!image) return undefined;

  try {
    return new URL(image, `${SITE_URL}/`).toString();
  } catch {
    return undefined;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = product.name;

  const description = cleanDescription(
    product.shortDescription ||
      product.fullDescription ||
      `Shop ${product.name} at Neeshanz. Discover premium quality T-shirts at affordable prices.`,
  );

  // Original database image path for OG and Twitter
  const image = product.images?.main;

  const canonical = `/products/${product.slug}`;

  const isActive = product.status === "Active";

  return {
    title,
    description,

    keywords: [
      product.name,
      product.category,
      product.sku,
      "Neeshanz",
      "Premium T-Shirts",
      "Buy T-Shirts Online",
    ].filter(Boolean),

    alternates: {
      canonical,
    },

    robots: {
      index: isActive,
      follow: true,
      googleBot: {
        index: isActive,
        follow: true,
      },
    },

    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: SITE_NAME,
      url: canonical,
      title: `${title} | ${SITE_NAME}`,
      description,

      // Database image path
      images: image
        ? [
            {
              url: image,
              alt: product.name,
            },
          ]
        : [],
    },

    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,

      // Database image path
      images: image ? [image] : [],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const isActive = product.status === "Active";

  const productUrl = `${SITE_URL}/products/${product.slug}`;

  // Absolute URLs only for JSON-LD
  const images = [product.images?.main, ...(product.images?.gallery ?? [])]
    .map(getAbsoluteImageUrl)
    .filter((image): image is string => Boolean(image));

  const price = product.pricing?.salePrice ?? product.pricing?.regularPrice;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",

    name: product.name,

    description: cleanDescription(
      product.fullDescription || product.shortDescription,
    ),

    image: images,

    sku: product.sku,

    category: product.category,

    ...(product.colors?.length > 0 && {
      color: product.colors.map((color: { name: string }) => color.name),
    }),

    ...(product.sizes?.length > 0 && {
      size: product.sizes.map((size: { label: string }) => size.label),
    }),

    offers: {
      "@type": "Offer",
      url: productUrl,

      priceCurrency: product.pricing?.currency || "BDT",

      price,

      availability:
        product.totalStock > 0 && isActive
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",

      itemCondition: "https://schema.org/NewCondition",
    },

    ...(product.ratings?.count > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.ratings.average,
        reviewCount: product.ratings.count,
      },
    }),
  };

  return (
    <>
      {isActive && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      )}

      <ProductDetailClient />
    </>
  );
}
