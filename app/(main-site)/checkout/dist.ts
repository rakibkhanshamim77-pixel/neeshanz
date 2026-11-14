// Approximate district centroids (Bengali names must match getDistricts())
export const DISTRICT_COORDS: { name: string; lat: number; lng: number }[] = [
  // ঢাকা
  { name: "ঢাকা", lat: 23.81, lng: 90.41 },
  { name: "গাজীপুর", lat: 24.0, lng: 90.42 },
  { name: "নারায়ণগঞ্জ", lat: 23.62, lng: 90.5 },
  { name: "নরসিংদী", lat: 23.92, lng: 90.72 },
  { name: "মানিকগঞ্জ", lat: 23.86, lng: 90.0 },
  { name: "মুন্সীগঞ্জ", lat: 23.55, lng: 90.53 },
  { name: "কিশোরগঞ্জ", lat: 24.43, lng: 90.78 },
  { name: "টাঙ্গাইল", lat: 24.25, lng: 89.92 },
  { name: "ফরিদপুর", lat: 23.61, lng: 89.84 },
  { name: "গোপালগঞ্জ", lat: 23.01, lng: 89.83 },
  { name: "মাদারীপুর", lat: 23.17, lng: 90.2 },
  { name: "রাজবাড়ী", lat: 23.76, lng: 89.64 },
  { name: "শরীয়তপুর", lat: 23.22, lng: 90.35 },
  // চট্টগ্রাম
  { name: "চট্টগ্রাম", lat: 22.36, lng: 91.78 },
  { name: "কক্সবাজার", lat: 21.43, lng: 92.01 },
  { name: "কুমিল্লা", lat: 23.46, lng: 91.18 },
  { name: "ব্রাহ্মণবাড়িয়া", lat: 23.96, lng: 91.11 },
  { name: "চাঁদপুর", lat: 23.23, lng: 90.67 },
  { name: "ফেনী", lat: 23.02, lng: 91.4 },
  { name: "নোয়াখালী", lat: 22.87, lng: 91.1 },
  { name: "লক্ষ্মীপুর", lat: 22.94, lng: 90.84 },
  { name: "খাগড়াছড়ি", lat: 23.12, lng: 91.98 },
  { name: "রাঙ্গামাটি", lat: 22.65, lng: 92.17 },
  { name: "বান্দরবান", lat: 22.2, lng: 92.22 },
  // রাজশাহী
  { name: "রাজশাহী", lat: 24.37, lng: 88.6 },
  { name: "নওগাঁ", lat: 24.8, lng: 88.93 },
  { name: "নাটোর", lat: 24.41, lng: 89.0 },
  { name: "চাঁপাইনবাবগঞ্জ", lat: 24.6, lng: 88.28 },
  { name: "পাবনা", lat: 24.0, lng: 89.23 },
  { name: "সিরাজগঞ্জ", lat: 24.45, lng: 89.7 },
  { name: "বগুড়া", lat: 24.85, lng: 89.37 },
  { name: "জয়পুরহাট", lat: 25.1, lng: 89.02 },
  // খুলনা
  { name: "খুলনা", lat: 22.82, lng: 89.55 },
  { name: "বাগেরহাট", lat: 22.65, lng: 89.79 },
  { name: "সাতক্ষীরা", lat: 22.72, lng: 89.07 },
  { name: "যশোর", lat: 23.17, lng: 89.21 },
  { name: "ঝিনাইদহ", lat: 23.54, lng: 89.17 },
  { name: "মাগুরা", lat: 23.49, lng: 89.42 },
  { name: "নড়াইল", lat: 23.17, lng: 89.5 },
  { name: "কুষ্টিয়া", lat: 23.9, lng: 89.12 },
  { name: "চুয়াডাঙ্গা", lat: 23.64, lng: 88.85 },
  { name: "মেহেরপুর", lat: 23.76, lng: 88.63 },
  // বরিশাল
  { name: "বরিশাল", lat: 22.7, lng: 90.37 },
  { name: "পটুয়াখালী", lat: 22.36, lng: 90.33 },
  { name: "ভোলা", lat: 22.69, lng: 90.65 },
  { name: "পিরোজপুর", lat: 22.58, lng: 89.97 },
  { name: "বরগুনা", lat: 22.15, lng: 90.12 },
  { name: "ঝালকাঠি", lat: 22.64, lng: 90.2 },
  // সিলেট
  { name: "সিলেট", lat: 24.9, lng: 91.87 },
  { name: "মৌলভীবাজার", lat: 24.48, lng: 91.77 },
  { name: "হবিগঞ্জ", lat: 24.38, lng: 91.42 },
  { name: "সুনামগঞ্জ", lat: 25.07, lng: 91.4 },
  // রংপুর
  { name: "রংপুর", lat: 25.75, lng: 89.25 },
  { name: "দিনাজপুর", lat: 25.63, lng: 88.64 },
  { name: "কুড়িগ্রাম", lat: 25.81, lng: 89.64 },
  { name: "গাইবান্ধা", lat: 25.33, lng: 89.53 },
  { name: "নীলফামারী", lat: 25.93, lng: 88.86 },
  { name: "লালমনিরহাট", lat: 25.99, lng: 89.45 },
  { name: "ঠাকুরগাঁও", lat: 26.03, lng: 88.46 },
  { name: "পঞ্চগড়", lat: 26.34, lng: 88.55 },
  // ময়মনসিংহ
  { name: "ময়মনসিংহ", lat: 24.75, lng: 90.41 },
  { name: "জামালপুর", lat: 24.92, lng: 89.94 },
  { name: "শেরপুর", lat: 25.02, lng: 90.02 },
  { name: "নেত্রকোণা", lat: 24.87, lng: 90.73 },
];

const BD_BOUNDS = { minLat: 20.5, maxLat: 26.7, minLng: 88.0, maxLng: 92.7 };
const MAX_DISTANCE_KM = 80;

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/** Returns the nearest district name (only from `allowed`), or null if outside Bangladesh. */
export function findDistrictByCoords(
  lat: number,
  lng: number,
  allowed: string[],
): string | null {
  if (
    lat < BD_BOUNDS.minLat ||
    lat > BD_BOUNDS.maxLat ||
    lng < BD_BOUNDS.minLng ||
    lng > BD_BOUNDS.maxLng
  )
    return null;

  let best: { name: string; dist: number } | null = null;
  for (const d of DISTRICT_COORDS) {
    if (!allowed.includes(d.name)) continue;
    const dist = haversineKm(lat, lng, d.lat, d.lng);
    if (!best || dist < best.dist) best = { name: d.name, dist };
  }
  return best && best.dist <= MAX_DISTANCE_KM ? best.name : null;
}
