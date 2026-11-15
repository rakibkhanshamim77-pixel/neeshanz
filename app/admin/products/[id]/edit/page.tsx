"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Spinner } from "@/components/ui/Spinner";
import {
  ArrowLeftIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

interface ColorVariant {
  name: string;
  hex: string;
  image: string | null;
}
interface SizeVariant {
  label: string;
  measurement: string;
  stock: number;
  lowStockAlert: number;
}

const CATEGORIES = [
  "T-Shirts",
  "Polo Shirts",
  "Hoodies",
  "Tank Tops",
  "Long Sleeves",
];
const STATUSES = ["Active", "Draft", "Out of Stock", "Archived"];

/** Accepts absolute http(s) URLs or site-relative paths like /uploads/a.jpg */
function isValidImageUrl(value: string) {
  const v = value.trim();
  if (!v) return false;
  if (v.startsWith("/") && !v.startsWith("//")) return true;
  try {
    const u = new URL(v);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

/** Preview of an image URL; shows a fallback if it fails to load. */
function ImagePreview({
  src,
  alt,
  sizes,
}: {
  src: string;
  alt: string;
  sizes?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-white/5 px-2 text-center text-[10px] text-gray-500 dark:text-gray-400">
        Can&apos;t load image
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className="object-cover"
      unoptimized
      onError={() => setFailed(true)}
    />
  );
}

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [shortDesc, setShortDesc] = useState("");
  const [fullDesc, setFullDesc] = useState("");
  const [regularPrice, setRegularPrice] = useState(0);
  const [salePrice, setSalePrice] = useState<number | "">("");
  const [mainImage, setMainImage] = useState("");
  const [gallery, setGallery] = useState<string[]>([]);
  const [galleryInput, setGalleryInput] = useState("");
  const [galleryError, setGalleryError] = useState("");
  const [colors, setColors] = useState<ColorVariant[]>([]);
  const [sizes, setSizes] = useState<SizeVariant[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [status, setStatus] = useState("Active");
  const [isFeatured, setIsFeatured] = useState(false);

  const fetchProduct = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/products/${id}`);
      const json = await res.json();
      if (json.success) {
        const p = json.data;
        setName(p.name);
        setSku(p.sku);
        setCategory(p.category);
        setShortDesc(p.shortDescription || "");
        setFullDesc(p.fullDescription || "");
        setRegularPrice(p.pricing.regularPrice);
        setSalePrice(p.pricing.salePrice ?? "");
        setMainImage(p.images?.main || "");
        setGallery(p.images?.gallery || []);
        setColors(p.colors || []);
        setSizes(p.sizes || []);
        setFeatures(p.features || []);
        setStatus(p.status);
        setIsFeatured(p.isFeatured || false);
      } else {
        setError("Product not found");
      }
    } catch {
      setError("Failed to load product");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const mainImageTrimmed = mainImage.trim();

  // Gallery: accepts one URL, or several separated by spaces, commas or new lines
  function addGalleryImages() {
    const urls = galleryInput
      .split(/[\s,]+/)
      .map((u) => u.trim())
      .filter(Boolean);
    if (urls.length === 0) return;

    if (urls.some((u) => !isValidImageUrl(u))) {
      setGalleryError(
        "Enter a valid image URL starting with http:// or https://",
      );
      return;
    }

    setGallery((prev) => [...prev, ...urls.filter((u) => !prev.includes(u))]);
    setGalleryInput("");
    setGalleryError("");
  }

  function updateColor(index: number, patch: Partial<ColorVariant>) {
    setColors((prev) =>
      prev.map((c, i) => (i === index ? { ...c, ...patch } : c)),
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (mainImageTrimmed && !isValidImageUrl(mainImageTrimmed)) {
        setError("Main image URL is not valid.");
        return;
      }
      const badColor = colors.find(
        (c) => c.image && c.image.trim() && !isValidImageUrl(c.image),
      );
      if (badColor) {
        setError(
          `Image URL for color "${badColor.name || "unnamed"}" is not valid.`,
        );
        return;
      }

      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          sku,
          category,
          shortDescription: shortDesc,
          fullDescription: fullDesc,
          pricing: {
            regularPrice,
            salePrice: salePrice === "" ? null : salePrice,
          },
          images: {
            main: mainImageTrimmed,
            gallery: gallery.map((u) => u.trim()),
          },
          colors: colors.map((c) => ({ ...c, image: c.image?.trim() || null })),
          sizes,
          features: features.filter((f) => f.trim()),
          status,
          isFeatured,
        }),
      });
      const json = await res.json();
      if (json.success) {
        router.push("/admin/products");
      } else {
        setError(json.message || "Failed to update product");
      }
    } catch {
      setError("Failed to update product");
    } finally {
      setSaving(false);
    }
  }

  const discount =
    regularPrice > 0 && salePrice !== "" && Number(salePrice) > 0
      ? Math.round(((regularPrice - Number(salePrice)) / regularPrice) * 100)
      : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" className="text-white dark:text-white" />
      </div>
    );
  }

  if (error && !name) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500">{error}</p>
        <Link
          href="/admin/products"
          className="text-gray-700 dark:text-white hover:underline mt-4 inline-block"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  const inputClass =
    "w-full bg-gray-100 dark:bg-white/5 border-none rounded-xl px-4 py-3 text-sm text-black dark:text-white";

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/products"
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-black dark:text-white">
          Edit Product
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl p-6 border border-gray-200 dark:border-white/10">
        <h2 className="text-lg font-semibold text-black dark:text-white mb-4">
          Basic Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
              Product Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
              SKU
            </label>
            <input
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputClass}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
              Short Description
            </label>
            <input
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
              Full Description
            </label>
            <textarea
              value={fullDesc}
              onChange={(e) => setFullDesc(e.target.value)}
              rows={4}
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl p-6 border border-gray-200 dark:border-white/10">
        <h2 className="text-lg font-semibold text-black dark:text-white mb-4">
          Pricing
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
              Regular Price (৳)
            </label>
            <input
              type="number"
              value={regularPrice}
              onChange={(e) => setRegularPrice(Number(e.target.value))}
              min={0}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
              Sale Price (৳)
            </label>
            <input
              type="number"
              value={salePrice}
              onChange={(e) =>
                setSalePrice(e.target.value ? Number(e.target.value) : "")
              }
              min={0}
              className={inputClass}
            />
          </div>
          <div className="flex items-end">
            {discount > 0 && (
              <span className="px-3 py-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl text-sm font-medium">
                {discount}% OFF
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl p-6 border border-gray-200 dark:border-white/10">
        <h2 className="text-lg font-semibold text-black dark:text-white mb-4">
          Images
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Main image */}
          <div>
            <label
              htmlFor="main-image-url"
              className="block text-sm text-gray-600 dark:text-gray-400 mb-2"
            >
              Main Image URL
            </label>
            <input
              id="main-image-url"
              type="url"
              value={mainImage}
              onChange={(e) => setMainImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className={inputClass}
            />
            {mainImageTrimmed && !isValidImageUrl(mainImageTrimmed) && (
              <p className="mt-2 text-xs text-red-400">
                Enter a valid URL starting with http:// or https://
              </p>
            )}
            {isValidImageUrl(mainImageTrimmed) && (
              <div className="relative mt-3 aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-white/5">
                <ImagePreview
                  key={mainImageTrimmed}
                  src={mainImageTrimmed}
                  alt="Main"
                  sizes="(min-width: 768px) 400px, 100vw"
                />
                <button
                  type="button"
                  onClick={() => setMainImage("")}
                  aria-label="Remove main image"
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Gallery */}
          <div>
            <label
              htmlFor="gallery-image-url"
              className="block text-sm text-gray-600 dark:text-gray-400 mb-2"
            >
              Gallery Image URLs
            </label>
            <div className="flex gap-2">
              <input
                id="gallery-image-url"
                type="text"
                value={galleryInput}
                onChange={(e) => {
                  setGalleryInput(e.target.value);
                  if (galleryError) setGalleryError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addGalleryImages();
                  }
                }}
                placeholder="Paste an image URL and press Enter"
                className={inputClass}
              />
              <button
                type="button"
                onClick={addGalleryImages}
                className="inline-flex shrink-0 items-center gap-1 px-4 rounded-xl text-sm font-medium bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-opacity"
              >
                <PlusIcon className="w-4 h-4" /> Add
              </button>
            </div>
            {galleryError ? (
              <p className="mt-2 text-xs text-red-400">{galleryError}</p>
            ) : (
              <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                You can paste several URLs at once, separated by commas, spaces
                or new lines.
              </p>
            )}

            {gallery.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {gallery.map((img, i) => (
                  <div
                    key={`${i}-${img}`}
                    className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-white/5"
                  >
                    <ImagePreview
                      src={img}
                      alt={`Gallery ${i + 1}`}
                      sizes="120px"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setGallery(gallery.filter((_, idx) => idx !== i))
                      }
                      aria-label={`Remove gallery image ${i + 1}`}
                      className="absolute top-1 right-1 p-0.5 bg-red-500 text-white rounded-full"
                    >
                      <TrashIcon className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Colors */}
      <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl p-6 border border-gray-200 dark:border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-black dark:text-white">
            Colors
          </h2>
          <button
            type="button"
            onClick={() =>
              setColors([...colors, { name: "", hex: "#000000", image: null }])
            }
            className="flex items-center gap-1 text-sm text-gray-700 dark:text-white"
          >
            <PlusIcon className="w-4 h-4" /> Add Color
          </button>
        </div>
        <div className="space-y-3">
          {colors.map((c, i) => {
            const colorImage = (c.image ?? "").trim();
            return (
              <div
                key={i}
                className="flex flex-col sm:flex-row sm:items-center gap-3"
              >
                <div className="flex items-center gap-3 flex-1">
                  <input
                    type="color"
                    value={c.hex}
                    onChange={(e) => updateColor(i, { hex: e.target.value })}
                    className="w-10 h-10 rounded-lg cursor-pointer shrink-0"
                  />
                  <input
                    value={c.name}
                    onChange={(e) => updateColor(i, { name: e.target.value })}
                    placeholder="Color name"
                    className="flex-1 min-w-0 bg-gray-100 dark:bg-white/5 border-none rounded-xl px-4 py-2 text-sm text-black dark:text-white"
                  />
                </div>
                <div className="flex items-center gap-2 flex-1">
                  {isValidImageUrl(colorImage) && (
                    <div className="relative w-10 h-10 shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-white/5">
                      <ImagePreview
                        key={colorImage}
                        src={colorImage}
                        alt={c.name || "Color"}
                        sizes="40px"
                      />
                    </div>
                  )}
                  <input
                    type="url"
                    value={c.image ?? ""}
                    onChange={(e) => updateColor(i, { image: e.target.value })}
                    placeholder="Color image URL (optional)"
                    className="flex-1 min-w-0 bg-gray-100 dark:bg-white/5 border-none rounded-xl px-4 py-2 text-sm text-black dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setColors(colors.filter((_, idx) => idx !== i))
                    }
                    aria-label="Remove color"
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sizes */}
      <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl p-6 border border-gray-200 dark:border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-black dark:text-white">
            Sizes
          </h2>
          <button
            type="button"
            onClick={() =>
              setSizes([
                ...sizes,
                { label: "M", measurement: "", stock: 0, lowStockAlert: 5 },
              ])
            }
            className="flex items-center gap-1 text-sm text-gray-700 dark:text-white"
          >
            <PlusIcon className="w-4 h-4" /> Add Size
          </button>
        </div>
        <div className="space-y-3">
          {sizes.map((s, i) => (
            <div key={i} className="grid grid-cols-5 gap-3 items-center">
              <select
                value={s.label}
                onChange={(e) => {
                  const arr = [...sizes];
                  arr[i].label = e.target.value;
                  setSizes(arr);
                }}
                className="bg-gray-100 dark:bg-white/5 border-none rounded-xl px-3 py-2 text-sm text-black dark:text-white"
              >
                {["S", "M", "L", "XL", "XXL", "3XL"].map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
              <input
                value={s.measurement}
                onChange={(e) => {
                  const arr = [...sizes];
                  arr[i].measurement = e.target.value;
                  setSizes(arr);
                }}
                placeholder="Measurement"
                className="bg-gray-100 dark:bg-white/5 border-none rounded-xl px-3 py-2 text-sm text-black dark:text-white"
              />
              <input
                type="number"
                value={s.stock}
                onChange={(e) => {
                  const arr = [...sizes];
                  arr[i].stock = Number(e.target.value);
                  setSizes(arr);
                }}
                min={0}
                placeholder="Stock"
                className="bg-gray-100 dark:bg-white/5 border-none rounded-xl px-3 py-2 text-sm text-black dark:text-white"
              />
              <input
                type="number"
                value={s.lowStockAlert}
                onChange={(e) => {
                  const arr = [...sizes];
                  arr[i].lowStockAlert = Number(e.target.value);
                  setSizes(arr);
                }}
                min={0}
                placeholder="Alert"
                className="bg-gray-100 dark:bg-white/5 border-none rounded-xl px-3 py-2 text-sm text-black dark:text-white"
              />
              <button
                type="button"
                onClick={() => setSizes(sizes.filter((_, idx) => idx !== i))}
                aria-label="Remove size"
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg justify-self-center"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl p-6 border border-gray-200 dark:border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-black dark:text-white">
            Features
          </h2>
          <button
            type="button"
            onClick={() => setFeatures([...features, ""])}
            className="flex items-center gap-1 text-sm text-gray-700 dark:text-white"
          >
            <PlusIcon className="w-4 h-4" /> Add Feature
          </button>
        </div>
        <div className="space-y-2">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-3">
              <input
                value={f}
                onChange={(e) => {
                  const arr = [...features];
                  arr[i] = e.target.value;
                  setFeatures(arr);
                }}
                placeholder="Feature description"
                className="flex-1 bg-gray-100 dark:bg-white/5 border-none rounded-xl px-4 py-2 text-sm text-black dark:text-white"
              />
              <button
                type="button"
                onClick={() =>
                  setFeatures(features.filter((_, idx) => idx !== i))
                }
                aria-label="Remove feature"
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Status */}
      <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl p-6 border border-gray-200 dark:border-white/10">
        <h2 className="text-lg font-semibold text-black dark:text-white mb-4">
          Status & Visibility
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={inputClass}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3 pt-6">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 peer-checked:bg-white dark:peer-checked:bg-white rounded-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:bg-black dark:peer-checked:after:bg-black" />
            </label>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Featured Product
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Link
          href="/admin/products"
          className="px-6 py-3 bg-gray-200 dark:bg-white/5 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-300 dark:hover:bg-white/10 transition-colors"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 bg-white text-black rounded-xl text-sm font-medium hover:bg-gray-100 dark:bg-white dark:text-black dark:hover:bg-gray-200 border border-gray-200 dark:border-white/20 transition-colors disabled:opacity-60 flex items-center gap-2"
        >
          {saving && <Spinner size="sm" className="text-black" />}
          Save Changes
        </button>
      </div>
    </form>
  );
}
