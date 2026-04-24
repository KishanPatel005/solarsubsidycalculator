export type IndianRegion =
  | "North"
  | "South"
  | "East"
  | "West"
  | "Central"
  | "Northeast";

export interface IndianStateOrUT {
  name: string;
  slug: string;
  capital: string;
  region: IndianRegion;
  type: "State" | "UnionTerritory";
}

// Regions are broad groupings for navigation/filtering (not an official classification).
export const statesAndUTs: readonly IndianStateOrUT[] = [
  // States (28)
  { name: "Andhra Pradesh", slug: "andhra-pradesh", capital: "Amaravati", region: "South", type: "State" },
  { name: "Arunachal Pradesh", slug: "arunachal-pradesh", capital: "Itanagar", region: "Northeast", type: "State" },
  { name: "Assam", slug: "assam", capital: "Dispur", region: "Northeast", type: "State" },
  { name: "Bihar", slug: "bihar", capital: "Patna", region: "East", type: "State" },
  { name: "Chhattisgarh", slug: "chhattisgarh", capital: "Raipur", region: "Central", type: "State" },
  { name: "Goa", slug: "goa", capital: "Panaji", region: "West", type: "State" },
  { name: "Gujarat", slug: "gujarat", capital: "Gandhinagar", region: "West", type: "State" },
  { name: "Haryana", slug: "haryana", capital: "Chandigarh", region: "North", type: "State" },
  { name: "Himachal Pradesh", slug: "himachal-pradesh", capital: "Shimla", region: "North", type: "State" },
  { name: "Jharkhand", slug: "jharkhand", capital: "Ranchi", region: "East", type: "State" },
  { name: "Karnataka", slug: "karnataka", capital: "Bengaluru", region: "South", type: "State" },
  { name: "Kerala", slug: "kerala", capital: "Thiruvananthapuram", region: "South", type: "State" },
  { name: "Madhya Pradesh", slug: "madhya-pradesh", capital: "Bhopal", region: "Central", type: "State" },
  { name: "Maharashtra", slug: "maharashtra", capital: "Mumbai", region: "West", type: "State" },
  { name: "Manipur", slug: "manipur", capital: "Imphal", region: "Northeast", type: "State" },
  { name: "Meghalaya", slug: "meghalaya", capital: "Shillong", region: "Northeast", type: "State" },
  { name: "Mizoram", slug: "mizoram", capital: "Aizawl", region: "Northeast", type: "State" },
  { name: "Nagaland", slug: "nagaland", capital: "Kohima", region: "Northeast", type: "State" },
  { name: "Odisha", slug: "odisha", capital: "Bhubaneswar", region: "East", type: "State" },
  { name: "Punjab", slug: "punjab", capital: "Chandigarh", region: "North", type: "State" },
  { name: "Rajasthan", slug: "rajasthan", capital: "Jaipur", region: "North", type: "State" },
  { name: "Sikkim", slug: "sikkim", capital: "Gangtok", region: "Northeast", type: "State" },
  { name: "Tamil Nadu", slug: "tamil-nadu", capital: "Chennai", region: "South", type: "State" },
  { name: "Telangana", slug: "telangana", capital: "Hyderabad", region: "South", type: "State" },
  { name: "Tripura", slug: "tripura", capital: "Agartala", region: "Northeast", type: "State" },
  { name: "Uttar Pradesh", slug: "uttar-pradesh", capital: "Lucknow", region: "North", type: "State" },
  { name: "Uttarakhand", slug: "uttarakhand", capital: "Dehradun", region: "North", type: "State" },
  { name: "West Bengal", slug: "west-bengal", capital: "Kolkata", region: "East", type: "State" },

  // Union Territories (8)
  { name: "Andaman and Nicobar Islands", slug: "andaman-and-nicobar-islands", capital: "Port Blair", region: "East", type: "UnionTerritory" },
  { name: "Chandigarh", slug: "chandigarh", capital: "Chandigarh", region: "North", type: "UnionTerritory" },
  { name: "Dadra and Nagar Haveli and Daman and Diu", slug: "dadra-and-nagar-haveli-and-daman-and-diu", capital: "Daman", region: "West", type: "UnionTerritory" },
  { name: "Delhi", slug: "delhi", capital: "New Delhi", region: "North", type: "UnionTerritory" },
  { name: "Jammu and Kashmir", slug: "jammu-and-kashmir", capital: "Srinagar (Summer), Jammu (Winter)", region: "North", type: "UnionTerritory" },
  { name: "Ladakh", slug: "ladakh", capital: "Leh", region: "North", type: "UnionTerritory" },
  { name: "Lakshadweep", slug: "lakshadweep", capital: "Kavaratti", region: "South", type: "UnionTerritory" },
  { name: "Puducherry", slug: "puducherry", capital: "Puducherry", region: "South", type: "UnionTerritory" },
] as const;

export const STATES = statesAndUTs.filter((x) => x.type === "State");
export const UNION_TERRITORIES = statesAndUTs.filter((x) => x.type === "UnionTerritory");

