export interface DemoSite {
  id: string;
  name: string;
  coordinates: [number, number]; // [lng, lat]
  area: number; // in square meters
  description: string;
  currentUse: string;
  potential: string;
  imageUrl?: string;
}

export const demoBangkokSites: DemoSite[] = [
  // Sites will be populated by AI detection
];

export const defaultSite = null; // No default site, user must use AI detection
