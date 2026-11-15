import type { MetadataRoute } from "next";

import { connectDB } from "@/lib/db/connectDB";
import Product from "@/lib/models/Product";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://neeshanz.com";

  try {
    // Connect directly to MongoDB
    await connectDB();

    // Fetch products directly from database
    const products = await Product.find({}).select("slug updatedAt").lean();

    const productUrls: MetadataRoute.Sitemap = products.map((product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: product.updatedAt
        ? new Date(product.updatedAt)
        : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

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
  } catch (error) {
    console.error("Sitemap generation failed:", error);

    return [
      {
        url: baseUrl,
        changeFrequency: "daily",
        priority: 1,
      },
      {
        url: `${baseUrl}/products`,
        changeFrequency: "daily",
        priority: 0.9,
      },
    ];
  }
}
