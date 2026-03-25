// Fire / appliance products organised by job type
// Prices ex VAT unless stated

export interface WoodburnerProduct {
  brand: string;
  name: string;
  kw: number | null;
  rrp: number;
}

export interface GasFireProduct {
  name: string;
  description: string;
  subCategory: string;
  slideControlNg?: number;
  remoteControlNg?: number;
  price?: number; // used when no control options
}

export interface GasStoveProduct {
  name: string;
  fuel: string;
  priceExVat: number;
}

export interface ElectricFireProduct {
  name: string;
  widthMm: number;
  priceExVat: number;
}

export interface ElectricFireTab {
  tabName: string;
  products: ElectricFireProduct[];
  realLogsUpgrade?: { label: string; price: number };
  optionalWoodLogSet?: { label: string; price: number };
  note?: string;
}

// ─────────────────────────────────────────────
//  GAS FIRE TRIM / FASCIA TYPES
// ─────────────────────────────────────────────

export interface TrimItem {
  name: string;
  priceExVat: number;
}

/**
 * For a given control type:
 * - fascias:      all-in-one products — select one, done
 * - frets:        decorative grilles — selecting one requires also picking a standardTrim
 * - standardTrims: paired with frets (mandatory when fret is chosen)
 */
export interface GasFireTrimControlConfig {
  fascias: TrimItem[];
  frets: TrimItem[];
  standardTrims: TrimItem[];
}

export interface GasFireTrimConfig {
  slide: GasFireTrimControlConfig;
  remote: GasFireTrimControlConfig;
}

// ─── Shared frets (same for all 16" fires) ────────────────
const FRETS_16: TrimItem[] = [
  { name: "Wellington Fret — Brass",            priceExVat: 100.00 },
  { name: "Wellington Fret — Antique",           priceExVat: 105.00 },
  { name: "Bayswater Fret — Brass",             priceExVat: 105.00 },
  { name: "Bayswater Fret — Chrome",            priceExVat: 105.00 },
  { name: "Gate Cast Iron Fret — Black",        priceExVat:  75.00 },
  { name: "Gate Cast Iron Fret — Brass",        priceExVat: 107.50 },
  { name: "Gate Cast Iron Fret — Chrome",       priceExVat: 107.50 },
  { name: "Gate Cast Iron Fret — Brushed Steel",priceExVat: 107.50 },
];

// ─── Fascias shared across slide & remote ─────────────────
const FASCIAS_BOTH_CONTROLS: TrimItem[] = [
  { name: "Cast Arch Fascia — Black",          priceExVat: 232.50 },
  { name: "Cast Arch Fascia — Chrome Highlight",priceExVat: 249.17 },
  { name: "Cast Arch Fascia — Brass Highlight", priceExVat: 290.83 },
  { name: "Square Cast Fascia — Pewter",        priceExVat: 415.83 },
  { name: "Square Cast Fascia — Brass",         priceExVat: 415.83 },
  { name: "Square Cast Fascia — Gun Metal",     priceExVat: 415.83 },
];

// ─── Slide-only fascias (open flame + glass fronted 16") ──
const FASCIAS_SLIDE_ONLY: TrimItem[] = [
  { name: "Edge Inset Fascia (Slide)",          priceExVat: 207.50 },
  { name: "Prestige Fascia — Nickel/Chrome",    priceExVat: 145.83 },
  { name: "Prestige Fascia — Nickel/Black",     priceExVat: 145.83 },
  { name: "Elite Fascia — Satin/Black",         priceExVat: 170.00 },
  { name: "Elite Fascia — Chrome/Black",        priceExVat: 170.00 },
  { name: "Elite Fascia — Chrome/Chrome",       priceExVat: 170.00 },
  { name: "Elite Fascia — Brass/Black",         priceExVat: 170.00 },
];

// ─── Remote-only fascias ───────────────────────────────────
const FASCIAS_REMOTE_ONLY: TrimItem[] = [
  { name: "Elite Fascia — Satin/Black",         priceExVat: 161.67 },
  { name: "Elite Fascia — Chrome/Black",        priceExVat: 161.67 },
  { name: "Elite Fascia — Chrome/Chrome",       priceExVat: 161.67 },
  { name: "Elite Fascia — Brass/Black",         priceExVat: 161.67 },
];

// ─── Extra slide fascia for glass-fronted only ─────────────
const FASCIAS_GLASS_FRONTED_SLIDE_EXTRA: TrimItem[] = [
  { name: "Prestige 4-Sided Fascia — Nickel/Chrome", priceExVat: 162.50 },
  { name: "Prestige 4-Sided Fascia — Nickel/Black",  priceExVat: 162.50 },
];

// ─── Standard trims (boxed, ordered separately from fire) ─────
// Open Flame — slide
const OPEN_FLAME_SLIDE_TRIMS: TrimItem[] = [
  { name: "Standard Trim — Brass",        priceExVat: 65.83 },
  { name: "Standard Trim — Black",        priceExVat: 65.83 },
  { name: "Standard Trim — Chrome",       priceExVat: 65.83 },
  { name: "Standard Trim — Brushed Steel",priceExVat: 65.83 },
];
// Open Flame — remote
const OPEN_FLAME_REMOTE_TRIMS: TrimItem[] = [
  { name: "Standard Trim — Black",        priceExVat: 56.67 },
  { name: "Standard Trim — Brass",        priceExVat: 56.67 },
  { name: "Standard Trim — Chrome",       priceExVat: 60.00 },
  { name: "Standard Trim — Brushed Steel",priceExVat: 60.00 },
];
// Glass Fronted — slide (same boxed price as open flame slide)
const GLASS_FRONTED_SLIDE_TRIMS: TrimItem[] = OPEN_FLAME_SLIDE_TRIMS;
// Glass Fronted — remote (different boxed prices for HE/RS/Core)
const GLASS_FRONTED_REMOTE_TRIMS: TrimItem[] = [
  { name: "Standard Trim — Brass",        priceExVat: 70.83 },
  { name: "Standard Trim — Black",        priceExVat: 70.83 },
  { name: "Standard Trim — Chrome",       priceExVat: 70.83 },
  { name: "Standard Trim — Brushed Steel",priceExVat: 70.83 },
];

// ─── Reusable configs ─────────────────────────────────────
const OPEN_FLAME_CONFIG: GasFireTrimConfig = {
  slide: {
    fascias: [...FASCIAS_SLIDE_ONLY, ...FASCIAS_BOTH_CONTROLS],
    frets: FRETS_16,
    standardTrims: OPEN_FLAME_SLIDE_TRIMS,
  },
  remote: {
    fascias: [...FASCIAS_REMOTE_ONLY, ...FASCIAS_BOTH_CONTROLS],
    frets: FRETS_16,
    standardTrims: OPEN_FLAME_REMOTE_TRIMS,
  },
};

const GLASS_FRONTED_CONFIG: GasFireTrimConfig = {
  slide: {
    fascias: [...FASCIAS_SLIDE_ONLY, ...FASCIAS_GLASS_FRONTED_SLIDE_EXTRA, ...FASCIAS_BOTH_CONTROLS],
    frets: FRETS_16,
    standardTrims: GLASS_FRONTED_SLIDE_TRIMS,
  },
  remote: {
    fascias: [...FASCIAS_REMOTE_ONLY, ...FASCIAS_BOTH_CONTROLS],
    frets: FRETS_16,
    standardTrims: GLASS_FRONTED_REMOTE_TRIMS,
  },
};

const EMPTY_CONFIG: GasFireTrimConfig = {
  slide: { fascias: [], frets: [], standardTrims: [] },
  remote: { fascias: [], frets: [], standardTrims: [] },
};

// ─── Model → trim config map ──────────────────────────────
// Open Flame fires
export const GAS_FIRE_TRIMS: Record<string, GasFireTrimConfig> = {
  // ── Open Flame CF ─────────────────────────────────────
  "Paragon 2000 Plus CF":
    OPEN_FLAME_CONFIG,

  "Paragon Slimline 3 CF": {
    // Slimline 3 is slide-only
    slide: OPEN_FLAME_CONFIG.slide,
    remote: { fascias: [], frets: [], standardTrims: [] },
  },

  "Paragon One Evolution CF — Coal Fuel Bed":
    OPEN_FLAME_CONFIG,

  "Paragon One Evolution CF — Mixed Logs Fuel Bed":
    OPEN_FLAME_CONFIG,

  // ── Glass Fronted CF ───────────────────────────────────
  "Paragon Focus HE CF":
    GLASS_FRONTED_CONFIG,

  "Paragon Core HE CF":
    GLASS_FRONTED_CONFIG,

  // ── Glass Fronted BF ───────────────────────────────────
  "Paragon Focus RS Plus BF":
    GLASS_FRONTED_CONFIG,

  "Paragon Core BF":
    GLASS_FRONTED_CONFIG,

  // ── Large Format CF — P11 ─────────────────────────────
  "Paragon P11 CF — Black Ribbed Liners": {
    slide: {
      fascias: [
        { name: "P11 Prestige Slide Trim — Nickel/Black",  priceExVat: 215.83 },
        { name: "P11 Prestige Slide Trim — Nickel/Chrome", priceExVat: 215.83 },
      ],
      frets: [], standardTrims: [],
    },
    remote: {
      fascias: [
        { name: "P11 Prestige Trim — Nickel/Black",  priceExVat: 215.83 },
        { name: "P11 Prestige Trim — Nickel/Chrome", priceExVat: 215.83 },
      ],
      frets: [], standardTrims: [],
    },
  },

  "Paragon P11 CF — Black Glass Liners": {
    slide: {
      fascias: [
        { name: "P11 Prestige Slide Trim — Nickel/Black",  priceExVat: 215.83 },
        { name: "P11 Prestige Slide Trim — Nickel/Chrome", priceExVat: 215.83 },
      ],
      frets: [], standardTrims: [],
    },
    remote: {
      fascias: [
        { name: "P11 Prestige Trim — Nickel/Black",  priceExVat: 215.83 },
        { name: "P11 Prestige Trim — Nickel/Chrome", priceExVat: 215.83 },
      ],
      frets: [], standardTrims: [],
    },
  },

  // ── Large Format CF — P5 ──────────────────────────────
  // No dedicated trim in pricelist (installed in limestone surrounds)
  "Paragon P5 CF — Black Ribbed Liners": EMPTY_CONFIG,
  "Paragon P5 CF — Black Glass Liners":  EMPTY_CONFIG,

  // ── Large Format BF ───────────────────────────────────
  "Paragon P5 BF — Black Ribbed Liners": EMPTY_CONFIG,
  "Paragon P5 BF — Black Glass Liners":  EMPTY_CONFIG,

  // ── Infinity 890HD CF ────────────────────────────────
  "Infinity 890HD CF Mk2": {
    slide: {
      fascias: [
        { name: "Prestige Trim — Nickel/Black",  priceExVat: 249.17 },
        { name: "Prestige Trim — Nickel/Chrome", priceExVat: 249.17 },
      ],
      frets: [], standardTrims: [],
    },
    remote: { fascias: [], frets: [], standardTrims: [] },
  },

  // ── Infinity 890HD BF ────────────────────────────────
  // Has installation kit options rather than decorative trims
  "Infinity 890HD BF": {
    slide: {
      fascias: [
        { name: "Slip Frame Kit",                                      priceExVat: 116.67 },
        { name: "Zero Clearance Kit (incl. Satin/Black Elite Trim)",   priceExVat: 479.17 },
        { name: "Limestone Slip Set",                                  priceExVat: 224.17 },
      ],
      frets: [], standardTrims: [],
    },
    remote: { fascias: [], frets: [], standardTrims: [] },
  },

  // ── Panache ───────────────────────────────────────────
  "Panache 620 Hybrid CF": {
    slide: {
      fascias: [
        { name: "Prestige Trim — Nickel/Black",  priceExVat: 282.50 },
        { name: "Prestige Trim — Nickel/Chrome", priceExVat: 282.50 },
      ],
      frets: [], standardTrims: [],
    },
    remote: { fascias: [], frets: [], standardTrims: [] },
  },

  "Panache 8040 CF": {
    slide: {
      fascias: [
        { name: "Prestige Trim — Nickel/Black",  priceExVat: 274.17 },
        { name: "Prestige Trim — Nickel/Chrome", priceExVat: 274.17 },
        { name: "Limestone Slips For 8040",       priceExVat: 207.50 },
        { name: "Panache 50mm Spacer Kit (3\" Rebate)", priceExVat: 115.83 },
      ],
      frets: [], standardTrims: [],
    },
    remote: { fascias: [], frets: [], standardTrims: [] },
  },
};

// ─────────────────────────────────────────────
//  GATHER HOOD — model → price ex VAT
// ─────────────────────────────────────────────
// Only listed for large-format CF fires; BF/Panache not applicable
export const GATHER_HOOD_PRICES: Record<string, number> = {
  "Paragon P11 CF — Black Ribbed Liners": 37.50,  // A-0845 P11 Gather Hood
  "Paragon P11 CF — Black Glass Liners":  37.50,
  "Paragon P5 CF — Black Ribbed Liners":  107.50, // A-0662 Infinity HD / P5 Gather Hood Assembly
  "Paragon P5 CF — Black Glass Liners":   107.50,
  "Infinity 890HD CF Mk2":                107.50,
};

// ─────────────────────────────────────────────
//  C&J COMPATIBLE PORTUGUESE LIMESTONE FIREPLACES
//  (shown for large-format fires only)
//  Source: "Fireplaces and Fireplace Elements for Gas Fires" page 17
// ─────────────────────────────────────────────

export interface CJFireplaceProduct {
  name: string;
  priceExVat: number;
  description: string;
}

const AYLESBURY_OPTIONS: CJFireplaceProduct[] = [
  {
    name: "Aylesbury 54\" Surround Only",
    priceExVat: 665.83,
    description: "Portuguese Limestone — surround only, 80mm rebate",
  },
  {
    name: "Aylesbury 54\" Complete Fireplace",
    priceExVat: 874.17,
    description: "Portuguese Limestone — surround, back panel & hearth, 80mm rebate",
  },
  {
    name: "Aylesbury 54\" Including Chamber",
    priceExVat: 1057.50,
    description: "Portuguese Limestone — surround, back panel, hearth & chamber, 80mm rebate",
  },
];

const BESPOKE_ELEMENTS: CJFireplaceProduct[] = [
  {
    name: "Bespoke 4 Piece Back Panel — Limestone",
    priceExVat: 215.83,
    description: "Cut to size",
  },
  {
    name: "Rebate Alteration Strip",
    priceExVat: 132.50,
    description: "",
  },
  {
    name: "Chamber Pieces 36\"×18\" (30mm thick)",
    priceExVat: 340.83,
    description: "Portuguese Limestone — use with rear hearth",
  },
  {
    name: "Rear Hearth 36\"×18\"",
    priceExVat: 207.50,
    description: "Portuguese Limestone — for use with stone chambers above",
  },
];

export const CJ_COMPATIBLE_FIREPLACES: Record<string, CJFireplaceProduct[]> = {
  "Paragon P11 CF — Black Ribbed Liners": [
    ...AYLESBURY_OPTIONS,
    { name: "Beckford Complete Fireplace", priceExVat: 749.17, description: "Portuguese Limestone, 80mm rebate" },
    ...BESPOKE_ELEMENTS,
  ],
  "Paragon P11 CF — Black Glass Liners": [
    ...AYLESBURY_OPTIONS,
    { name: "Beckford Complete Fireplace", priceExVat: 749.17, description: "Portuguese Limestone, 80mm rebate" },
    ...BESPOKE_ELEMENTS,
  ],
  "Paragon P5 CF — Black Ribbed Liners": [
    ...AYLESBURY_OPTIONS,
    { name: "Wenlock Complete Fireplace for P5", priceExVat: 1199.17, description: "Portuguese Limestone, 80mm rebate" },
    ...BESPOKE_ELEMENTS,
  ],
  "Paragon P5 CF — Black Glass Liners": [
    ...AYLESBURY_OPTIONS,
    { name: "Wenlock Complete Fireplace for P5", priceExVat: 1199.17, description: "Portuguese Limestone, 80mm rebate" },
    ...BESPOKE_ELEMENTS,
  ],
  "Paragon P5 BF — Black Ribbed Liners": [
    ...AYLESBURY_OPTIONS,
    { name: "Wenlock Complete Fireplace for P5", priceExVat: 1199.17, description: "Portuguese Limestone, 80mm rebate" },
    ...BESPOKE_ELEMENTS,
  ],
  "Paragon P5 BF — Black Glass Liners": [
    ...AYLESBURY_OPTIONS,
    { name: "Wenlock Complete Fireplace for P5", priceExVat: 1199.17, description: "Portuguese Limestone, 80mm rebate" },
    ...BESPOKE_ELEMENTS,
  ],
  "Infinity 890HD CF Mk2": [
    ...AYLESBURY_OPTIONS,
    { name: "Balmoral Complete Fireplace", priceExVat: 857.50, description: "Portuguese Limestone, 80mm rebate" },
    ...BESPOKE_ELEMENTS,
  ],
};

// ─────────────────────────────────────────────
//  WOODBURNER (Chimney Liner & Twin Wall share same products)
// ─────────────────────────────────────────────
export const WOODBURNER_PRODUCTS: WoodburnerProduct[] = [
  { brand: "Chesneys", name: "The Alpine 4kW", kw: 4, rrp: 1799 },
  { brand: "Chesneys", name: "The Salisbury 4kW", kw: 4, rrp: 1399 },
  { brand: "Chesneys", name: "The Salisbury 5kW", kw: 5, rrp: 1719 },
  { brand: "Chesneys", name: "The Salisbury 5kW LS", kw: 5, rrp: 1819 },
  { brand: "Chesneys", name: "The Salisbury 8kW", kw: 8, rrp: 2149 },
  { brand: "Chesneys", name: "The Salisbury 8kW Double-Sided", kw: 8, rrp: 2589 },
  { brand: "Chesneys", name: "The Salisbury 12kW", kw: 12, rrp: 2799 },
  { brand: "Chesneys", name: "The Beaumont 4kW", kw: 4, rrp: 1529 },
  { brand: "Chesneys", name: "The Beaumont 5kW", kw: 5, rrp: 1999 },
  { brand: "Chesneys", name: "The Beaumont 8kW", kw: 8, rrp: 2259 },
  { brand: "Chesneys", name: "The Shoreditch 4kW", kw: 4, rrp: 1529 },
  { brand: "Chesneys", name: "The Shoreditch 5kW", kw: 5, rrp: 1819 },
  { brand: "Chesneys", name: "The Shoreditch 5kW LS", kw: 5, rrp: 1889 },
  { brand: "Chesneys", name: "The Shoreditch 8kW", kw: 8, rrp: 2389 },
  { brand: "Chesneys", name: "The Sanctuary 5kW", kw: 5, rrp: 1759 },
  { brand: "Chesneys", name: "The Sanctuary 5kW LS", kw: 5, rrp: 1829 },
  { brand: "Chesneys", name: "The Serendipity 5kW", kw: 5, rrp: 1819 },
  { brand: "Chesneys", name: "The Serendipity 5kW LS", kw: 5, rrp: 1889 },
  { brand: "Chesneys", name: "The Solstice 5kW LS Low Base", kw: 5, rrp: 2369 },
  { brand: "Chesneys", name: "The Solstice 5kW LS Standard", kw: 5, rrp: 2469 },
  { brand: "Chesneys", name: "The Solstice 5kW Pedestal", kw: 5, rrp: 2569 },
  { brand: "Westleigh", name: "Westleigh 5 Slimline Single Door", kw: 5, rrp: 1569 },
  { brand: "Westleigh", name: "Westleigh 5 Slimline Double Door", kw: 5, rrp: 1569 },
  { brand: "Isca", name: "Isca 4", kw: 4, rrp: 1399 },
  { brand: "Isca", name: "Isca 5", kw: 5, rrp: 1499 },
  { brand: "Isca", name: "Isca 7", kw: 7, rrp: 1789 },
  { brand: "Capital", name: "Atmos 105R", kw: null, rrp: 695 },
  { brand: "Capital", name: "Atmos 135R", kw: null, rrp: 795 },
  { brand: "Capital", name: "Atmos 165R", kw: null, rrp: 895 },
  { brand: "Capital", name: "Atmos 195R", kw: null, rrp: 995 },
  { brand: "Capital", name: "Atlas 1 Single Window", kw: 5, rrp: 1495 },
  { brand: "Capital", name: "Atlas 2 Side Windows", kw: 6, rrp: 1695 },
  { brand: "Capital", name: "Atlas 3 Side Windows", kw: 6, rrp: 1995 },
];

// ─────────────────────────────────────────────
//  GAS FIRE — BALANCED FLUE (BF)
// ─────────────────────────────────────────────
export const GAS_BF_PRODUCTS: GasFireProduct[] = [
  // Glass Fronted
  {
    name: "Paragon Focus RS Plus BF",
    description: "Glass Fronted, Coal",
    subCategory: "Glass Fronted Fires",
    slideControlNg: 1157.50,
    remoteControlNg: 1240.83,
  },
  {
    name: "Paragon Core BF",
    description: "Glass Fronted, Flat Bed, Mixed Logs, Black Glass Liners",
    subCategory: "Glass Fronted Fires",
    slideControlNg: 1449.17,
    remoteControlNg: 1624.17,
  },
  // Large Format
  {
    name: "Paragon P5 BF — Black Ribbed Liners",
    description: "Large Format",
    subCategory: "Large Format Fires",
    price: 2390.83,
  },
  {
    name: "Paragon P5 BF — Black Glass Liners",
    description: "Large Format",
    subCategory: "Large Format Fires",
    price: 2582.50,
  },
  {
    name: "Infinity 890HD BF",
    description: "Large Format, Mixed Logs, Black Glass Liners, inc. Snorkel Flue",
    subCategory: "Large Format Fires",
    price: 2249.17,
  },
];

// ─────────────────────────────────────────────
//  GAS FIRE — INSET (CONVENTIONAL FLUE)
// ─────────────────────────────────────────────
export const GAS_CF_PRODUCTS: GasFireProduct[] = [
  // Open Flame
  {
    name: "Paragon 2000 Plus CF",
    description: "Open Flame, Coal",
    subCategory: "Open Flame Fires",
    slideControlNg: 515.83,
    remoteControlNg: 682.50,
  },
  {
    name: "Paragon Slimline 3 CF",
    description: "Open Flame, Coal",
    subCategory: "Open Flame Fires",
    slideControlNg: 499.17,
  },
  {
    name: "Paragon One Evolution CF — Coal Fuel Bed",
    description: "Open Flame",
    subCategory: "Open Flame Fires",
    slideControlNg: 524.17,
    remoteControlNg: 665.83,
  },
  {
    name: "Paragon One Evolution CF — Mixed Logs Fuel Bed",
    description: "Open Flame",
    subCategory: "Open Flame Fires",
    slideControlNg: 582.50,
    remoteControlNg: 724.17,
  },
  // Glass Fronted
  {
    name: "Paragon Focus HE CF",
    description: "Glass Fronted, Coal",
    subCategory: "Glass Fronted Fires",
    slideControlNg: 787.50,
    remoteControlNg: 907.50,
  },
  {
    name: "Paragon Core HE CF",
    description: "Glass Fronted, Flat Bed, Mixed Logs, Black Glass Liners",
    subCategory: "Glass Fronted Fires",
    slideControlNg: 1066.67,
    remoteControlNg: 1224.17,
  },
  // Large Format
  {
    name: "Paragon P11 CF — Black Ribbed Liners",
    description: "Large Format",
    subCategory: "Large Format Fires",
    slideControlNg: 1082.50,
    remoteControlNg: 1540.83,
  },
  {
    name: "Paragon P11 CF — Black Glass Liners",
    description: "Large Format",
    subCategory: "Large Format Fires",
    slideControlNg: 1165.83,
    remoteControlNg: 1624.17,
  },
  {
    name: "Paragon P5 CF — Black Ribbed Liners",
    description: "Large Format",
    subCategory: "Large Format Fires",
    price: 1624.17,
  },
  {
    name: "Paragon P5 CF — Black Glass Liners",
    description: "Large Format",
    subCategory: "Large Format Fires",
    price: 1807.50,
  },
  {
    name: "Infinity 890HD CF Mk2",
    description: "Large Format, Mixed Logs",
    subCategory: "Large Format Fires",
    price: 2082.50,
  },
  {
    name: "Panache 620 Hybrid CF",
    description: "Hybrid Gas Fire",
    subCategory: "Large Format Fires",
    price: 1999.17,
  },
  {
    name: "Panache 8040 CF",
    description: "Large Format",
    subCategory: "Large Format Fires",
    price: 1582.50,
  },
];

// ─────────────────────────────────────────────
//  GAS STOVE (Conventional Flue)
// ─────────────────────────────────────────────
export const GAS_STOVE_PRODUCTS: GasStoveProduct[] = [
  // Conventional Flue
  { name: "Paragon Edge Conventional Flue NG", fuel: "Natural Gas (CF)", priceExVat: 1499.17 },
  { name: "Paragon Edge Conventional Flue LPG", fuel: "LPG (CF)", priceExVat: 1499.17 },
  { name: "Paragon Edge CF NG with Vermiculite Liners", fuel: "Natural Gas (CF)", priceExVat: 1457.50 },
  // Balanced Flue
  { name: "Paragon Edge BF Gas Stove NG (With Snorkel Flue)", fuel: "Natural Gas (BF)", priceExVat: 1974.17 },
  { name: "Paragon Edge BF Gas Stove NG (With Top Vent Kit)", fuel: "Natural Gas (BF)", priceExVat: 1974.17 },
  { name: "Paragon Edge 3-Sided BF Gas Stove NG (With Snorkel Flue)", fuel: "Natural Gas (BF)", priceExVat: 2190.83 },
  { name: "Paragon Edge 3-Sided BF Gas Stove NG (With Top Vent Kit)", fuel: "Natural Gas (BF)", priceExVat: 2190.83 },
];

// ─────────────────────────────────────────────
//  C&J 16" ELECTRIC FIRES (for "16 Inch Fire with Fireplace" style)
// ─────────────────────────────────────────────
export interface CJ16FireProduct {
  name: string;
  priceExVat: number;
  description: string; // fascia finish / type
}

export const CJ_16_INCH_FIRES: CJ16FireProduct[] = [
  // 3D Ecoflame
  { name: "3D Ecoflame 16\" Engine Only", description: "Engine only, fascia sold separately", priceExVat: 335.00 },
  { name: "3D Ecoflame 16\" — Elite Satin/Black Fascia", description: "Complete with Elite fascia", priceExVat: 420.00 },
  { name: "3D Ecoflame 16\" — Elite Chrome/Black Fascia", description: "Complete with Elite fascia", priceExVat: 420.00 },
  { name: "3D Ecoflame 16\" — Elite Brass/Black Fascia", description: "Complete with Elite fascia", priceExVat: 420.00 },
  { name: "3D Ecoflame 16\" — Elite Chrome/Chrome Fascia", description: "Complete with Elite fascia", priceExVat: 420.00 },
  { name: "3D Ecoflame 16\" — Prestige Nickel/Black Fascia", description: "Complete with Prestige fascia", priceExVat: 425.00 },
  { name: "3D Ecoflame 16\" — Prestige Nickel/Chrome Fascia", description: "Complete with Prestige fascia", priceExVat: 425.00 },
  { name: "3D Ecoflame 16\" — Cast Arch Fascia Black", description: "Complete with Cast Arch fascia", priceExVat: 507.50 },
  { name: "3D Ecoflame 16\" — Cast Arch Fascia Chrome", description: "Complete with Cast Arch fascia", priceExVat: 507.50 },
  { name: "3D Ecoflame 16\" — Cast Arch Fascia Brass", description: "Complete with Cast Arch fascia", priceExVat: 507.50 },
  { name: "3D Ecoflame 16\" — Square Cast Fascia Pewter", description: "Complete with Square Cast fascia", priceExVat: 628.33 },
  { name: "3D Ecoflame 16\" — Square Cast Fascia Brass", description: "Complete with Square Cast fascia", priceExVat: 628.33 },
  { name: "3D Ecoflame 16\" — Square Cast Fascia Gun Metal", description: "Complete with Square Cast fascia", priceExVat: 628.33 },
  // 4D Ecoflame
  { name: "4D Ecoflame 16\" Engine Only", description: "Engine only, fascia sold separately", priceExVat: 379.17 },
  { name: "4D Ecoflame 16\" — Elite Brass/Black Fascia", description: "Complete with Elite fascia", priceExVat: 455.00 },
  { name: "4D Ecoflame 16\" — Elite Chrome/Black Fascia", description: "Complete with Elite fascia", priceExVat: 455.00 },
  { name: "4D Ecoflame 16\" — Elite Satin/Black Fascia", description: "Complete with Elite fascia", priceExVat: 455.00 },
  { name: "4D Ecoflame 16\" — Elite Chrome/Chrome Fascia", description: "Complete with Elite fascia", priceExVat: 455.00 },
  { name: "4D Ecoflame 16\" — Prestige Nickel/Black Fascia", description: "Complete with Prestige fascia", priceExVat: 457.50 },
  { name: "4D Ecoflame 16\" — Prestige Nickel/Chrome Fascia", description: "Complete with Prestige fascia", priceExVat: 457.50 },
  { name: "4D Ecoflame 16\" — Cast Arch Fascia Black", description: "Complete with Cast Arch fascia", priceExVat: 539.17 },
  { name: "4D Ecoflame 16\" — Cast Arch Fascia Chrome", description: "Complete with Cast Arch fascia", priceExVat: 539.17 },
  { name: "4D Ecoflame 16\" — Cast Arch Fascia Brass", description: "Complete with Cast Arch fascia", priceExVat: 539.17 },
  { name: "4D Ecoflame 16\" — Square Cast Fascia Pewter", description: "Complete with Square Cast fascia", priceExVat: 659.17 },
  { name: "4D Ecoflame 16\" — Square Cast Fascia Brass", description: "Complete with Square Cast fascia", priceExVat: 659.17 },
  { name: "4D Ecoflame 16\" — Square Cast Fascia Gun Metal", description: "Complete with Square Cast fascia", priceExVat: 659.17 },
  { name: "4D Ecoflame 16\" — Elite Satin/Black + Lights", description: "Complete with Elite fascia & trim lights", priceExVat: 565.83 },
  { name: "4D Ecoflame 16\" — Elite Chrome/Black + Lights", description: "Complete with Elite fascia & trim lights", priceExVat: 565.83 },
  { name: "4D Ecoflame 16\" — Elite Brass/Black + Lights", description: "Complete with Elite fascia & trim lights", priceExVat: 565.83 },
  { name: "4D Ecoflame 16\" — Elite Chrome/Chrome + Lights", description: "Complete with Elite fascia & trim lights", priceExVat: 565.83 },
  // Opulus Real Flame Technology
  { name: "Opulus 16\" RFT Engine Only", description: "Real Flame Technology, engine only", priceExVat: 832.50 },
  { name: "Opulus 16\" RFT — Prestige Nickel/Chrome Fascia", description: "Complete with Prestige fascia", priceExVat: 957.50 },
  { name: "Opulus 16\" RFT — Prestige Nickel/Black Fascia", description: "Complete with Prestige fascia", priceExVat: 957.50 },
  { name: "Opulus 16\" RFT — Elite Brass/Black Fascia", description: "Complete with Elite fascia", priceExVat: 957.50 },
  { name: "Opulus 16\" RFT — Elite Chrome/Black Fascia", description: "Complete with Elite fascia", priceExVat: 957.50 },
  { name: "Opulus 16\" RFT — Elite Satin/Black Fascia", description: "Complete with Elite fascia", priceExVat: 957.50 },
  { name: "Opulus 16\" RFT — Elite Chrome/Chrome Fascia", description: "Complete with Elite fascia", priceExVat: 957.50 },
  // Gas fire: Panache 620 Hybrid (C&J — fits 16" with fireplace installations)
  { name: "Panache 620 Hybrid CF (Gas)", description: "C&J Panache 620 Hybrid Conventional Flue gas fire", priceExVat: 1999.17 },
];

// ─────────────────────────────────────────────
//  ELECTRIC FIRE / MEDIA WALL
// ─────────────────────────────────────────────
export const ELECTRIC_FIRE_TABS: ElectricFireTab[] = [
  {
    tabName: "iRange Slimline",
    products: [
      { name: "iRange Slimline i560e", widthMm: 560, priceExVat: 832.50 },
      { name: "iRange Slimline i790e", widthMm: 790, priceExVat: 957.50 },
      { name: "iRange Slimline i920e", widthMm: 920, priceExVat: 957.50 },
      { name: "iRange Slimline i1100e", widthMm: 1100, priceExVat: 1190.83 },
      { name: "iRange Slimline i1500e", widthMm: 1500, priceExVat: 1390.83 },
      { name: "iRange Slimline i2000e", widthMm: 2000, priceExVat: 1665.83 },
    ],
    realLogsUpgrade: { label: "Real Oak Premium Log Set", price: 115.83 },
  },
  {
    tabName: "iRange Deep",
    products: [
      { name: "iRange Deep i750e", widthMm: 750, priceExVat: 1332.50 },
      { name: "iRange Deep i1000e", widthMm: 1000, priceExVat: 1332.50 },
      { name: "iRange Deep i1250e", widthMm: 1250, priceExVat: 1457.50 },
      { name: "iRange Deep i1500e", widthMm: 1500, priceExVat: 1665.83 },
      { name: "iRange Deep i1800e", widthMm: 1800, priceExVat: 1874.17 },
      { name: "iRange Deep i2200e", widthMm: 2200, priceExVat: 2249.17 },
    ],
    realLogsUpgrade: { label: "Real Oak Premium Log Set", price: 165.83 },
    optionalWoodLogSet: { label: "Real Wood Log Set", price: 82.50 },
  },
  {
    tabName: "Luminosa",
    products: [
      { name: "Luminosa 62", widthMm: 620, priceExVat: 1499.17 },
      { name: "Luminosa 110", widthMm: 1100, priceExVat: 1999.17 },
      { name: "Luminosa 150", widthMm: 1500, priceExVat: 2495.83 },
      { name: "Luminosa 185", widthMm: 1850, priceExVat: 3082.50 },
    ],
    note: "Real Flame Technology — Birch & Oak Logs included as standard.",
  },
];
