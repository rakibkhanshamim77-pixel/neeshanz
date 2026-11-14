import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://neeshanz.com";

  const products = await fetch(`${baseUrl}/api/products`).then((res) =>
    res.json(),
  );

  const productUrls = products.map(
    (product: { slug: string; updatedAt: string }) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: new Date(product.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }),
  );

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },

    {
      url: `${baseUrl}/products`,
      changeFrequency: "daily",
      priority: 0.9,
    },

    ...productUrls,
  ];
}
