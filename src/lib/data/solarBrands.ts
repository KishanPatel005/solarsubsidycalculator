export type SolarBrand = {
  slug: "tata" | "waaree" | "luminous" | "loom-solar" | "vikram" | "adani";
  name: string;
  founded: string;
  hq: string;
  capacity: string;
  popularModels: { name: string; typicalPricePerWattINR: number; notes?: string }[];
  efficiency: string;
  warranty: string;
  pros: string[];
  cons: string[];
  whereToBuy: string[];
  ratingOutOf5: number;
};

export const solarBrandsIndia2026: readonly SolarBrand[] = [
  {
    slug: "tata",
    name: "Tata Power Solar",
    founded: "1989",
    hq: "Bengaluru, Karnataka",
    capacity: "Large-scale manufacturing + EPC network",
    popularModels: [
      { name: "Mono PERC (DCR/Non-DCR)", typicalPricePerWattINR: 26, notes: "Popular for residential rooftops" },
      { name: "Half-cut mono modules", typicalPricePerWattINR: 27 },
    ],
    efficiency: "Typically ~20%+ (model-dependent)",
    warranty: "Product ~12 years; performance ~25 years (varies by series)",
    pros: ["Strong brand trust", "Wide installer network", "Good service availability"],
    cons: ["Often priced at a premium", "Model availability varies by region"],
    whereToBuy: ["Authorized Tata Power Solar partners", "EPC installers", "Marketplace listings (verify warranty)"],
    ratingOutOf5: 4.6,
  },
  {
    slug: "waaree",
    name: "Waaree Energies",
    founded: "1989",
    hq: "Mumbai, Maharashtra",
    capacity: "High-volume module manufacturing",
    popularModels: [
      { name: "Mono PERC modules", typicalPricePerWattINR: 24, notes: "Common value pick" },
      { name: "Bifacial modules", typicalPricePerWattINR: 25 },
    ],
    efficiency: "Typically ~19.5%–21.5% (model-dependent)",
    warranty: "Product ~12 years; performance ~25 years (varies by series)",
    pros: ["Good value pricing", "Strong supply availability", "Broad model range"],
    cons: ["Warranty/service depends on channel quality", "Specs vary across SKUs"],
    whereToBuy: ["Waaree channel partners", "Distributors", "EPC installers"],
    ratingOutOf5: 4.4,
  },
  {
    slug: "luminous",
    name: "Luminous Solar",
    founded: "1988",
    hq: "Gurugram, Haryana",
    capacity: "Solar + inverter ecosystem; strong retail network",
    popularModels: [
      { name: "Mono PERC panels", typicalPricePerWattINR: 24, notes: "Often bundled with inverters" },
      { name: "Poly/entry panels (where available)", typicalPricePerWattINR: 22 },
    ],
    efficiency: "Typically ~18.5%–20.5% (model-dependent)",
    warranty: "Product ~10–12 years; performance ~25 years (varies by series)",
    pros: ["Strong dealer network", "Good bundle options (inverter + battery)", "Easy availability"],
    cons: ["Not always the cheapest per watt", "Model lineup differs by city"],
    whereToBuy: ["Luminous dealers", "EPC installers", "Large electronics retailers"],
    ratingOutOf5: 4.2,
  },
  {
    slug: "loom-solar",
    name: "Loom Solar",
    founded: "2018",
    hq: "Faridabad, Haryana",
    capacity: "D2C-friendly brand; strong online presence",
    popularModels: [
      { name: "Mono PERC panels", typicalPricePerWattINR: 23, notes: "Often sold online; verify service partner" },
      { name: "Shark / premium series (varies)", typicalPricePerWattINR: 24 },
    ],
    efficiency: "Typically ~19%–21% (model-dependent)",
    warranty: "Product ~10–12 years; performance ~25 years (varies by series)",
    pros: ["Online buying convenience", "Competitive pricing", "Fast availability in many regions"],
    cons: ["Service experience depends on local partner", "Installer coordination needed"],
    whereToBuy: ["Brand website", "Marketplace listings", "Local partners/ installers"],
    ratingOutOf5: 4.0,
  },
  {
    slug: "vikram",
    name: "Vikram Solar",
    founded: "2006",
    hq: "Kolkata, West Bengal",
    capacity: "Large manufacturing + export footprint",
    popularModels: [
      { name: "Mono PERC / half-cut modules", typicalPricePerWattINR: 24 },
      { name: "Bifacial modules", typicalPricePerWattINR: 25 },
    ],
    efficiency: "Typically ~19.5%–21.5% (model-dependent)",
    warranty: "Product ~12 years; performance ~25 years (varies by series)",
    pros: ["Strong manufacturing track record", "Good quality perception", "Wide SKU range"],
    cons: ["Availability varies by distributor", "Pricing depends on channel"],
    whereToBuy: ["Authorized distributors", "EPC installers"],
    ratingOutOf5: 4.3,
  },
  {
    slug: "adani",
    name: "Adani Solar",
    founded: "2015",
    hq: "Ahmedabad, Gujarat",
    capacity: "Integrated manufacturing ecosystem",
    popularModels: [
      { name: "Mono PERC modules", typicalPricePerWattINR: 24 },
      { name: "High-wattage half-cut modules", typicalPricePerWattINR: 25 },
    ],
    efficiency: "Typically ~19.5%–21.5% (model-dependent)",
    warranty: "Product ~12 years; performance ~25 years (varies by series)",
    pros: ["Strong manufacturing scale", "Good availability via EPCs", "Competitive pricing"],
    cons: ["Limited direct retail visibility in some cities", "SKU details vary across channels"],
    whereToBuy: ["EPC installers", "Distributors", "Project procurement channels"],
    ratingOutOf5: 4.2,
  },
] as const;

