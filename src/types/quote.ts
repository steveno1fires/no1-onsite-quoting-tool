import { Extra } from "@/types/extra";
import { EXTRAS_CONFIG } from "@/data/extrasConfig";

export type { Extra };

export interface CustomerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}

export const JOB_TYPES = [
  "Woodburner—Chimney Liner",
  "Woodburner—Twin Wall",
  "Gas Fire—Balanced Flue",
  "Gas Fire—Inset",
  "Gas Stove",
  "Electric Fire/Media Wall",
  "Gas Media Wall",
  "Air Conditioning",
  "Biofuel Fire",
  "Sweep & Care Plan",
  "Gas Service Plan",
] as const;

export type JobType = (typeof JOB_TYPES)[number];

export interface Product {
  brand: string;
  model: string;
  kw?: string;
  price: number;
}

export interface OptionalProduct {
  enabled: boolean;
  description: string;
  price: number;
}

export interface Products {
  fire: Product;
  woodburner: Product;
  fireplace: OptionalProduct;
  hearth: OptionalProduct;
  chamber: OptionalProduct & { size: string };
  beam: OptionalProduct & { material: string };
  surround: OptionalProduct;
}


export interface LinerKitAccessory {
  label: string;
  enabled: boolean;
  price: number;
}

export interface LinerKit {
  kitType: "Bungalow (6m)" | "House (12m)" | "Custom";
  flueSize: '5"' | '6"';
  system: "Schiedel Techno Flex" | "Mi Flues";
  grade: "316L" | "904L";
  regPlateSize: string;
  regPlatePrice: number;
  accessories: LinerKitAccessory[];
  price: number;
}

export interface TwinWallKit {
  system: "Schiedel ICID" | "Mi Flue TW Pro";
  colour: "Stainless Steel" | "Black" | "RAL";
  kitType: "Bungalow (6m)" | "House (12m)" | "Custom";
  flueSize: '5"' | '6"';
  price: number;
  additionalItemDescription: string;
  additionalItemPrice: number;
}

export interface SitePhotos {
  current: string[];
  upClose: string[];
  outside: string[];
}

export interface QuoteData {
  customer: CustomerDetails;
  jobType: JobType | "";
  products: Products;
  extras: Extra[];
  linerKit: LinerKit;
  twinWallKit: TwinWallKit;
  notes: string;
  photos: SitePhotos;
  includeVat: boolean;
}

export const initialQuoteData: QuoteData = {
  customer: { firstName: "", lastName: "", email: "", phone: "", address: "" },
  jobType: "",
  products: {
    fire: { brand: "", model: "", kw: "", price: 0 },
    woodburner: { brand: "", model: "", kw: "", price: 0 },
    hearth: { enabled: false, description: "", price: 0 },
    chamber: { enabled: false, description: "", size: "", price: 0 },
    beam: { enabled: false, description: "", material: "", price: 0 },
    surround: { enabled: false, description: "", price: 0 },
  },
  extras: EXTRAS_CONFIG.map((c) => ({ label: c.label, enabled: false, price: 0 })),
  linerKit: {
    kitType: "House (12m)",
    flueSize: '5"',
    system: "Schiedel Techno Flex",
    grade: "316L",
    regPlateSize: "",
    regPlatePrice: 0,
    accessories: [
      { label: "45° Bend", enabled: false, price: 50 },
      { label: "Offset Bend", enabled: false, price: 50 },
      { label: "Adjustable Length", enabled: false, price: 50 },
      { label: "Debris Collar", enabled: false, price: 50 },
    ],
    price: 450,
  },
  twinWallKit: {
    system: "Schiedel ICID",
    colour: "Stainless Steel",
    kitType: "House (12m)",
    flueSize: '5"',
    price: 450,
    additionalItemDescription: "",
    additionalItemPrice: 0,
  },
  notes: "",
  photos: { current: [], upClose: [], outside: [] },
  includeVat: true,
};
