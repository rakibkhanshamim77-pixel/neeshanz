import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2"
      aria-label="Neeshanz Home"
    >
      <div className="w-10 h-10 bg-gray-100 dark:bg-[#1a1a1a] rounded-sm flex items-center justify-center">
        <span className="text-black dark:text-white font-bold text-lg">NZ</span>
      </div>
      <div className="hidden sm:block">
        <h1 className="text-black dark:text-white font-bold text-lg -mb-2.5">
          NEESHANZ
        </h1>
        <span className="text-[10px] uppercase tracking-[0.2em] text-black/70 dark:text-white/70">
          Next Level Tees
        </span>
      </div>
    </Link>
  );
}
