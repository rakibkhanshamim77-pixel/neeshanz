import "server-only";
import { cache } from "react";
import { connectDB } from "@/lib/db/connectDB";
import Product from "@/lib/models/Product";

const PUBLIC_STATUSES = ["Active", "Out of Stock"];

export const getProductBySlug = cache(async (slug: string) => {
  const cleanSlug = slug?.trim();
  if (!cleanSlug) return null;

  try {
    await connectDB();

    const product = await Product.findOne({
      slug: cleanSlug,
      status: { $in: PUBLIC_STATUSES },
    }).lean();

    return product ? JSON.parse(JSON.stringify(product)) : null;
  } catch (error) {
    console.error("getProductBySlug error:", error);
    return null;
  }
});
