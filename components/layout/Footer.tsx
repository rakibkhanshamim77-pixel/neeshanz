"use client";

import { useState, useEffect, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { Logo } from "./Logo";

/* ---------- Inline SVG icons ---------- */

type IconProps = { className?: string };

function Svg({ className, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

const MailIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </Svg>
);

const PhoneIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
  </Svg>
);

const MapPinIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z" />
    <circle cx="12" cy="10" r="3" />
  </Svg>
);

const ClockIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </Svg>
);

const FacebookIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </Svg>
);

const InstagramIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </Svg>
);

const LinkedinIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </Svg>
);

const TruckIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </Svg>
);

const RefreshIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </Svg>
);

const ShieldIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </Svg>
);

const HeadsetIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
  </Svg>
);

const ArrowUpIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <line x1="12" y1="19" x2="12" y2="5" />
    <polyline points="5 12 12 5 19 12" />
  </Svg>
);

const SendIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </Svg>
);

/* ---------- Data ---------- */

interface SettingsData {
  store?: {
    storeName?: string;
    storeEmail?: string;
    storePhone?: string;
    storeAddress?: string;
  };
  shipping?: unknown;
  payment?: unknown;
  social?: { facebook?: string; instagram?: string; linkedin?: string };
}

type IconComponent = (props: IconProps) => ReactNode;

const PERKS: { icon: IconComponent; title: string; text: string }[] = [
  { icon: TruckIcon, title: "Fast delivery", text: "Across Bangladesh" },
  { icon: RefreshIcon, title: "Easy exchange", text: "Wrong size? We swap it" },
  {
    icon: ShieldIcon,
    title: "Secure checkout",
    text: "Your payment stays safe",
  },
  { icon: HeadsetIcon, title: "Real support", text: "Talk to a real person" },
];

const SHOP_LINKS = [
  { label: "All products", href: "/shop" },
  { label: "New arrivals", href: "/shop" },
  { label: "Best sellers", href: "/shop?sort=popular" },
  { label: "Sale", href: "/shop?filter=rating" },
];

const HELP_LINKS = [
  { label: "Track your order", href: "/track-order" },
  { label: "Shipping info", href: "/shipping" },
];

const COMPANY_LINKS = [
  { label: "About us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "My cart", href: "/cart" },
  { label: "My account", href: "/profile" },
];

const PAYMENT_METHODS = ["bKash", "Nagad", "Rocket", "Cash on delivery"];

/* ---------- Component ---------- */

export function Footer() {
  const [settings, setSettings] = useState<SettingsData | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) setSettings(json.data);
      })
      .catch(() => {});
  }, []);

  const store = settings?.store;
  const social = settings?.social;
  const storeName = store?.storeName || "Neeshanz";

  const socials = [
    { label: "Facebook", href: social?.facebook, icon: FacebookIcon },
    { label: "Instagram", href: social?.instagram, icon: InstagramIcon },
    { label: "LinkedIn", href: social?.linkedin, icon: LinkedinIcon },
  ].filter(
    (s): s is { label: string; href: string; icon: typeof FacebookIcon } =>
      Boolean(s.href),
  );

  const linkClass =
    "text-sm text-gray-600 transition-colors hover:text-black focus-visible:text-black dark:text-gray-400 dark:hover:text-white dark:focus-visible:text-white";

  return (
    <footer className="border-t border-gray-200 bg-white pb-28 dark:border-gray-800 dark:bg-black lg:pb-32">
      {/* Perks strip */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-4 lg:px-8">
          {PERKS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main grid */}
        <div className="grid grid-cols-2 gap-10 py-12 md:grid-cols-4 lg:grid-cols-12 lg:gap-8">
          {/* Brand + newsletter */}
          <div className="col-span-2 md:col-span-4 lg:col-span-4">
            <Logo />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              Shop Neeshanz for trendy fashion, stylish clothing, and everyday
              comfort. Discover quality outfits that combine modern style,
              affordability, and comfort. Free delivery available.
            </p>
          </div>

          {/* Shop */}
          <nav aria-label="Shop" className="lg:col-span-2">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              Shop
            </h3>
            <ul className="mt-4 space-y-3">
              {SHOP_LINKS.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Help */}
          <nav aria-label="Help" className="lg:col-span-2">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              Help
            </h3>
            <ul className="mt-4 space-y-3">
              {HELP_LINKS.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company */}
          <nav aria-label="Company" className="lg:col-span-2">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              Company
            </h3>
            <ul className="mt-4 space-y-3">
              {COMPANY_LINKS.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact + social */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              Contact
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-400">
              {store?.storeEmail && (
                <li className="flex items-start gap-3">
                  <MailIcon className="mt-0.5 h-4 w-4 shrink-0" />
                  <a
                    href={`mailto:${store.storeEmail}`}
                    className="break-all hover:text-black dark:hover:text-white"
                  >
                    {store.storeEmail}
                  </a>
                </li>
              )}
              {store?.storePhone && (
                <li className="flex items-start gap-3">
                  <PhoneIcon className="mt-0.5 h-4 w-4 shrink-0" />
                  <a
                    href={`tel:${store.storePhone.replace(/\s/g, "")}`}
                    className="hover:text-black dark:hover:text-white"
                  >
                    {store.storePhone}
                  </a>
                </li>
              )}
              {store?.storeAddress && (
                <li className="flex items-start gap-3">
                  <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{store.storeAddress}</span>
                </li>
              )}
              <li className="flex items-start gap-3">
                <ClockIcon className="mt-0.5 h-4 w-4 shrink-0" />
                <span>Sat–Thu, 10am–8pm</span>
              </li>
            </ul>

            {socials.length > 0 && (
              <>
                <h3 className="mt-8 text-base font-semibold text-gray-900 dark:text-white">
                  Follow us
                </h3>
                <ul className="mt-4 flex gap-3">
                  {socials.map(({ label, href, icon: Icon }) => (
                    <li key={label}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-gray-700 transition-colors hover:border-teal-500 hover:bg-teal-500 hover:text-white dark:border-gray-700 dark:text-gray-300"
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        {/* Payment methods */}
        <div className="flex flex-col gap-4 border-t border-gray-200 py-6 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">We accept</p>
          <ul className="flex flex-wrap gap-2">
            {PAYMENT_METHODS.map((m) => (
              <li
                key={m}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300"
              >
                {m}
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 border-t border-gray-200 pt-6 dark:border-gray-800 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold text-gray-900 dark:text-white">
              {storeName}
            </span>{" "}
            © {new Date().getFullYear()} All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/privacy-policy" className={linkClass}>
              Privacy Policy
            </Link>
            <Link href="/terms" className={linkClass}>
              Terms &amp; Conditions
            </Link>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:border-teal-500 hover:text-teal-600 dark:border-gray-700 dark:text-gray-300 dark:hover:text-teal-400"
            >
              <ArrowUpIcon className="h-3.5 w-3.5" />
              Back to top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
