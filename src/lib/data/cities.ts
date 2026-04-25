export type CitySolarData = {
  slug: string;
  name: string;
  stateSlug: string; // must match statesAndUTs slug
  stateName: string;
  discom: string;
  avgTariff: string;
  sunHours: number;
};

export const topCities2026: readonly CitySolarData[] = [
  { slug: "ahmedabad", name: "Ahmedabad", stateSlug: "gujarat", stateName: "Gujarat", discom: "UGVCL", avgTariff: "₹5.50", sunHours: 5.8 },
  { slug: "mumbai", name: "Mumbai", stateSlug: "maharashtra", stateName: "Maharashtra", discom: "MSEDCL / BEST", avgTariff: "₹6.00", sunHours: 5.3 },
  { slug: "delhi", name: "Delhi", stateSlug: "delhi", stateName: "Delhi", discom: "BSES / TPDDL", avgTariff: "₹6.50", sunHours: 5.2 },
  { slug: "bangalore", name: "Bangalore", stateSlug: "karnataka", stateName: "Karnataka", discom: "BESCOM", avgTariff: "₹6.15", sunHours: 5.4 },
  { slug: "pune", name: "Pune", stateSlug: "maharashtra", stateName: "Maharashtra", discom: "MSEDCL", avgTariff: "₹6.00", sunHours: 5.4 },
  { slug: "hyderabad", name: "Hyderabad", stateSlug: "telangana", stateName: "Telangana", discom: "TSSPDCL", avgTariff: "₹5.80", sunHours: 5.5 },
  { slug: "chennai", name: "Chennai", stateSlug: "tamil-nadu", stateName: "Tamil Nadu", discom: "TANGEDCO", avgTariff: "₹5.30", sunHours: 5.3 },
  { slug: "jaipur", name: "Jaipur", stateSlug: "rajasthan", stateName: "Rajasthan", discom: "JVVNL", avgTariff: "₹5.75", sunHours: 5.9 },
  { slug: "lucknow", name: "Lucknow", stateSlug: "uttar-pradesh", stateName: "Uttar Pradesh", discom: "MVVNL", avgTariff: "₹5.50", sunHours: 4.9 },
  { slug: "surat", name: "Surat", stateSlug: "gujarat", stateName: "Gujarat", discom: "DGVCL", avgTariff: "₹5.50", sunHours: 5.7 },
  { slug: "kolkata", name: "Kolkata", stateSlug: "west-bengal", stateName: "West Bengal", discom: "CESC", avgTariff: "₹5.20", sunHours: 4.8 },
  { slug: "chandigarh", name: "Chandigarh", stateSlug: "chandigarh", stateName: "Chandigarh", discom: "PSPCL", avgTariff: "₹5.00", sunHours: 4.9 },
  { slug: "indore", name: "Indore", stateSlug: "madhya-pradesh", stateName: "Madhya Pradesh", discom: "MPMKVVCL", avgTariff: "₹5.25", sunHours: 5.5 },
  { slug: "bhopal", name: "Bhopal", stateSlug: "madhya-pradesh", stateName: "Madhya Pradesh", discom: "MPMKVVCL", avgTariff: "₹5.25", sunHours: 5.4 },
  { slug: "nagpur", name: "Nagpur", stateSlug: "maharashtra", stateName: "Maharashtra", discom: "MSEDCL", avgTariff: "₹6.00", sunHours: 5.5 },
  { slug: "vadodara", name: "Vadodara", stateSlug: "gujarat", stateName: "Gujarat", discom: "MGVCL", avgTariff: "₹5.50", sunHours: 5.7 },
  { slug: "coimbatore", name: "Coimbatore", stateSlug: "tamil-nadu", stateName: "Tamil Nadu", discom: "TANGEDCO", avgTariff: "₹5.30", sunHours: 5.5 },
  { slug: "patna", name: "Patna", stateSlug: "bihar", stateName: "Bihar", discom: "SBPDCL", avgTariff: "₹5.00", sunHours: 4.8 },
  { slug: "jodhpur", name: "Jodhpur", stateSlug: "rajasthan", stateName: "Rajasthan", discom: "JDVVNL", avgTariff: "₹5.75", sunHours: 6.0 },
  { slug: "agra", name: "Agra", stateSlug: "uttar-pradesh", stateName: "Uttar Pradesh", discom: "DVVNL", avgTariff: "₹5.50", sunHours: 5.0 },
] as const;

export function getCityBySlug(slug: string): CitySolarData | null {
  return topCities2026.find((c) => c.slug === slug) ?? null;
}

export function getNearbyCities(slug: string): CitySolarData[] {
  const city = getCityBySlug(slug);
  if (!city) return [];

  const sameState = topCities2026.filter((c) => c.slug !== slug && c.stateSlug === city.stateSlug);
  if (sameState.length >= 6) return sameState.slice(0, 6);

  const fallback = topCities2026.filter((c) => c.slug !== slug && c.stateSlug !== city.stateSlug).slice(0, 6 - sameState.length);
  return [...sameState, ...fallback];
}

