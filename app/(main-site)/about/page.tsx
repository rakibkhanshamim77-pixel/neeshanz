import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "আমাদের সম্পর্কে | Neeshanz",
  description:
    "Neeshanz — ফ্যাশন আর কমফর্টের মেলবন্ধনে তৈরি টি-শার্টের বাংলাদেশি ব্র্যান্ড।",
};

const values = [
  {
    title: "আরামদায়ক কাপড়",
    text: "সারাদিন পরলেও যেন অস্বস্তি না হয়, তাই কাপড় বাছাইয়ে আমরা সবচেয়ে বেশি সময় দিই। নরম, শ্বাস নেওয়ার মতো আর ধোয়ার পরেও আগের মতো থাকে এমন কাপড়ই আমাদের পছন্দ।",
  },
  {
    title: "নিজের মতো ডিজাইন",
    text: "ভিড়ের মধ্যে মিশে যাওয়ার জন্য নয়, নিজের একটা পরিচয় তুলে ধরার জন্য টি-শার্ট। আমাদের প্রতিটি ডিজাইনে থাকে সহজ, পরিষ্কার আর মনে রাখার মতো একটা ভাবনা।",
  },
  {
    title: "ঠিকঠাক ফিটিং",
    text: "না বেশি ঢিলা, না বেশি টাইট। সাইজ চার্ট দেখে নিশ্চিন্তে অর্ডার করুন, যেন হাতে পেয়ে প্রথমবার পরাতেই ভালো লাগে।",
  },
  {
    title: "ভরসার সার্ভিস",
    text: "অর্ডার থেকে ডেলিভারি পর্যন্ত আমরা পাশে আছি। কোনো সমস্যা হলে সরাসরি আমাদের জানান, আমরা দ্রুত সমাধানের চেষ্টা করি।",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* হিরো */}
      <section className="mx-auto grid max-w-6xl items-center gap-14 px-6 pb-20 pt-24 md:grid-cols-[1.4fr_1fr] md:pt-32">
        <div>
          <p className="mb-5 text-sm tracking-widest text-teal-400">
            আমাদের সম্পর্কে
          </p>
          <h1 className="text-4xl font-bold leading-[1.35] md:text-6xl md:leading-[1.3]">
            একটা টি-শার্ট,
            <br />
            যেটা আপনার কথা বলে।
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-9 text-neutral-400">
            Neeshanz মানে “নিশান” — পরিচয়ের চিহ্ন। আমরা বিশ্বাস করি, ভালো পোশাক
            শুধু দেখতে সুন্দর হলেই হয় না, পরে আরামও পাওয়া চাই। তাই ফ্যাশন আর
            কমফর্ট, দুটোকে একসাথে নিয়েই আমাদের পথচলা।
          </p>
        </div>

        {/* কাপড়ের লেবেলের আদলে কার্ড — পেজের মূল ভিজ্যুয়াল */}
        <div className="mx-auto w-full max-w-xs rotate-3 transition-transform duration-300 hover:rotate-0">
          <div className="relative rounded-2xl border border-neutral-800 bg-neutral-950 px-8 pb-10 pt-14 text-center">
            <span
              aria-hidden
              className="absolute left-1/2 top-5 h-4 w-4 -translate-x-1/2 rounded-full border border-neutral-700 bg-black"
            />
            <p className="text-3xl font-bold tracking-wide">Neeshanz</p>
            <div className="mx-auto my-5 h-px w-12 bg-teal-400" />
            <p className="text-neutral-400">Fashion &amp; Comfort</p>
            <p className="mt-8 text-sm leading-7 text-neutral-500">
              আপনার স্টাইল,
              <br />
              আপনার আরাম।
            </p>
          </div>
        </div>
      </section>

      {/* আমাদের গল্প */}
      <section className="border-t border-neutral-900">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-[1fr_1.6fr]">
          <h2 className="text-3xl font-bold leading-snug md:text-4xl">
            আমাদের গল্প
          </h2>
          <div className="space-y-6 text-lg leading-9 text-neutral-300">
            <p>
              শুরুটা খুব সাধারণ একটা প্রশ্ন থেকে — পছন্দের ডিজাইনের টি-শার্ট কেন
              আরামদায়ক কাপড়ে পাওয়া যাবে না? বাজারে স্টাইলিশ টি-শার্ট অনেক
              আছে, কিন্তু কয়েকবার ধোয়ার পরই রং আর ফিটিং নষ্ট হয়ে যায়। আবার
              আরামদায়ক যেগুলো, সেগুলোতে নেই নিজের কিছু বলার মতো ডিজাইন।
            </p>
            <p>
              এই ফাঁকটা পূরণ করতেই Neeshanz-এর জন্ম। আমরা এমন টি-শার্ট বানাই
              যেটা পরে ক্লাসে যাওয়া যায়, আড্ডায় বসা যায়, আবার ঘুরতে বেরোনোও
              যায়।
            </p>
            <p>
              আজ আমরা দেশের নানা প্রান্তের ক্রেতাদের কাছে পৌঁছে যাচ্ছি, আর
              প্রতিটি অর্ডারকে আমরা একজন মানুষের ভরসা হিসেবেই দেখি।
            </p>
          </div>
        </div>
      </section>

      {/* আমরা যা মানি */}
      <section className="border-t border-neutral-900">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="mb-12 text-3xl font-bold md:text-4xl">আমরা যা মানি</h2>
          <div className="grid gap-x-16 gap-y-12 md:grid-cols-2">
            {values.map((v) => (
              <div key={v.title} className="border-l-2 border-teal-400 pl-6">
                <h3 className="mb-3 text-xl font-semibold">{v.title}</h3>
                <p className="leading-8 text-neutral-400">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* কল টু অ্যাকশন */}
      <section className="border-t border-neutral-900">
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h2 className="text-3xl font-bold leading-snug md:text-4xl">
            পছন্দের টি-শার্টটা খুঁজে নিন
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-8 text-neutral-400">
            নতুন ডিজাইনগুলো দেখুন, সাইজ বেছে নিন, আর ঘরে বসেই অর্ডার করুন।
          </p>
          {/* লিংকটা আপনার শপ/কালেকশন পেজের রুট অনুযায়ী বদলে নিন */}
          <Link
            href="/shop"
            className="mt-10 inline-block rounded-xl bg-white px-8 py-4 font-semibold text-black transition hover:bg-neutral-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-400"
          >
            কালেকশন দেখুন
          </Link>
        </div>
      </section>
    </main>
  );
}
