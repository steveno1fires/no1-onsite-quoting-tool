import { Extra } from "@/types/extra";
import { EXTRAS_CONFIG } from "@/data/extrasConfig";

export type { Extra };

export interface CustomerDetails {
  jobNumber: string;
  sm8ClientId?: string;
  clientName: string;
  email: string;
  phone: string;
  address: string;
}

export const JOB_TYPES = [
  "Woodburner — Chimney Liner",
  "Woodburner — Twin Wall",
  "Gas Fire — Balanced Flue (BF)",
  "Gas Fire — Inset (Conventional Flue)",
  "Gas Stove",
  "Electric Fire / Media Wall",
] as const;

export type JobType = (typeof JOB_TYPES)[number];

export type ElectricStyle = "Media Wall" | "Hole in the Wall" | "With Fireplace" | "16 Inch Fire with Fireplace";

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

export interface ChamberBoardSelection {
  enabled: boolean;
  boardName: string;
  boardPrice: number;
  reededPanels: boolean;
  chamberTrimKit: boolean;
  chamberTrimColour: "Black" | "Stainless Steel";
}

export interface HearthSelection {
  enabled: boolean;
  description: string;
  price: number;
  description2: string;
  price2: number;
}

export interface BfFitting {
  label: string;
  enabled: boolean;
  price: number;
}

export interface MediaWallItems {
  clsTimberQty: number;
  plasterboardQty: number;
  cornerBeadQty: number;
  tvBracket: boolean;
  plastered: boolean;
  electricSockets: boolean;
}

export interface GasFireTrim {
  /** The fascia name OR the fret name (when pairedTrim is set) */
  name: string;
  priceExVat: number;
  /** Set when this is a fret+trim combo: the standard trim paired with the fret */
  pairedTrimName?: string;
  pairedTrimPrice?: number;
}

export interface GasFireGatherHood {
  enabled: boolean;
  priceExVat: number;
}

export interface CJFireplaceItem {
  name: string;
  priceExVat: number;
  description: string;
}

export interface Products {
  fire: Product;
  hearth: HearthSelection;
  beam: OptionalProduct & { material: string };
  surround: OptionalProduct;
  chamberBoard: ChamberBoardSelection;
  gasFirebox: boolean;
  gasFireTrim: GasFireTrim | null;
  gasFireGatherHood: GasFireGatherHood;
  cjFireplace: CJFireplaceItem | null;
  gasFireLining?: string; // Gazco lining option (e.g., "Black Glass", "Brick Effect")
  gasFireFrame?: string; // Gazco frame option (e.g., "Icon XS - Black Glass")
  electricStyle: ElectricStyle;
  bfFittings: BfFitting[];
  mediaWallItems: MediaWallItems;
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
  labourDays: number;
  notes: string;
  photos: SitePhotos;
  includeVat: boolean;
  sm8JobId?: string;
  jobDetails?: string;
}

export const initialQuoteData: QuoteData = {
  customer: { jobNumber: "", clientName: "", email: "", phone: "", address: "" },
  jobType: "",
  products: {
    fire: { brand: "", model: "", kw: "", price: 0 },
    hearth: { enabled: false, description: "", price: 0, description2: "", price2: 0 },
    beam: { enabled: false, description: "", material: "", price: 0 },
    surround: { enabled: false, description: "", price: 0 },
    chamberBoard: {
      enabled: false,
      boardName: "",
      boardPrice: 0,
      reededPanels: false,
      chamberTrimKit: false,
      chamberTrimColour: "Black",
    },
    gasFirebox: false,
    gasFireTrim: null,
    gasFireGatherHood: { enabled: false, priceExVat: 0 },
    cjFireplace: null,
    gasFireLining: undefined,
    gasFireFrame: undefined,
    electricStyle: "Media Wall",
    bfFittings: [
      { label: "Flue Terminal / Cowl", enabled: false, price: 85 },
      { label: "Wall Plate / Liner Adapter", enabled: false, price: 65 },
      { label: "90° Elbow", enabled: false, price: 55 },
      { label: "45° Elbow", enabled: false, price: 55 },
      { label: "BF Extension Flue Pipe (per length)", enabled: false, price: 75 },
      { label: "Horizontal BF Flue Kit", enabled: false, price: 120 },
    ],
    mediaWallItems: {
      clsTimberQty: 0,
      plasterboardQty: 0,
      cornerBeadQty: 0,
      tvBracket: false,
      plastered: false,
      electricSockets: false,
    },
  },
  extras: EXTRAS_CONFIG.map((c) => ({ label: c.label, enabled: false, price: 0 })),
  labourDays: 0,
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
