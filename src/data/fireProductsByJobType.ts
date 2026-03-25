// Fire / appliance products organised by job type
// Prices ex VAT unless stated

export interface WoodburnerProduct {
  brand: string;
  name: string;
  kw: number | null;
  rrp: number;
}

export interface GasFireProduct {
  brand?: string; // defaults to "C&J" when undefined
  name: string;
  description: string;
  subCategory: string;
  slideControlNg?: number;
  remoteControlNg?: number;
  price?: number; // used when no control options
}

export interface GasStoveProduct {
  brand?: string; // defaults to "C&J" when undefined
  name: string;
  fuel: string;
  priceExVat: number;
}

export interface ElectricFireProduct {
  name: string;
  widthMm?: number; // omit for stoves / products where width isn't relevant
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
//  ONYX ELECTRIC FIRE PRODUCTS (prices inc VAT)
// ─────────────────────────────────────────────

export interface OnyxElectricProduct {
  name: string;
  series: string; // sub-group within Onyx range
  priceIncVat: number;
}

export interface OnyxElectricAddon {
  id: string;
  label: string;
  priceIncVat?: number; // undefined = price varies / POA
}

export const ONYX_ELECTRIC_PRODUCTS: OnyxElectricProduct[] = [
  // Avita Electric
  { series: "Avita Electric",                                  name: "Avita 120RW",                             priceIncVat: 1995 },
  { series: "Avita Electric",                                  name: "Avita 160RW",                             priceIncVat: 2395 },
  { series: "Avita Electric",                                  name: "Avita 190RW",                             priceIncVat: 2895 },
  // Avanti Electric — Real Woodland Logscape
  { series: "Avanti Electric (Real Woodland Logscape)",        name: "Avanti 110RW (Real Woodland Logscape)",   priceIncVat: 2395 },
  { series: "Avanti Electric (Real Woodland Logscape)",        name: "Avanti 150RW (Real Woodland Logscape)",   priceIncVat: 2795 },
  { series: "Avanti Electric (Real Woodland Logscape)",        name: "Avanti 190RW (Real Woodland Logscape)",   priceIncVat: 3595 },
  // Avanti Electric — Standard Oak Log Set
  { series: "Avanti Electric (Standard Oak Log Set)",          name: "Avanti 110RW (Standard Oak Log Set)",     priceIncVat: 2095 },
  { series: "Avanti Electric (Standard Oak Log Set)",          name: "Avanti 150RW (Standard Oak Log Set)",     priceIncVat: 2495 },
  { series: "Avanti Electric (Standard Oak Log Set)",          name: "Avanti 190RW (Standard Oak Log Set)",     priceIncVat: 3189 },
  // Fusion Electric
  { series: "Fusion Electric",                                 name: "Fusion 150RW (Real Wood Logscape)",       priceIncVat: 3575 },
  { series: "Fusion Electric",                                 name: "Fusion 150RW (Birch Log Effect)",         priceIncVat: 3255 },
];

export const ONYX_ELECTRIC_ADDONS: OnyxElectricAddon[] = [
  { id: "edge-xl-frame",          label: "Edge XL Frame" },
  { id: "mood-lighting-kit",      label: "Mood Lighting Kit",              priceIncVat: 119 },
  { id: "silver-birch-log-upgrade", label: "Silver Birch Log Set upgrade" },
];

// ─────────────────────────────────────────────
//  ONYX GAS FIRE OPTIONAL FRAMES (prices inc VAT)
// ─────────────────────────────────────────────
export interface OnyxFrameOption {
  name: string;
  priceIncVat: number;
}

/** Optional frames for Onyx CF gas fires */
export const ONYX_CF_FRAME_OPTIONS: OnyxFrameOption[] = [
  { name: "Edge+ Frame (Small)",      priceIncVat: 135 },
  { name: "Edge+ Frame (Large)",      priceIncVat: 159 },
  { name: "Expression Frame (Small)", priceIncVat: 265 },
  { name: "Expression Frame (Large)", priceIncVat: 285 },
];

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

// ── Complete packages only — surround + back panel + hearth bundled.
//    Bespoke individual elements (back panel, rebate strip, chamber pieces,
//    rear hearth) are removed; customers who need bespoke work should be
//    quoted separately.
export const CJ_COMPATIBLE_FIREPLACES: Record<string, CJFireplaceProduct[]> = {
  "Paragon P11 CF — Black Ribbed Liners": [
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
    {
      name: "Beckford Complete Fireplace",
      priceExVat: 749.17,
      description: "Portuguese Limestone — surround, back panel & hearth, 80mm rebate",
    },
  ],
  "Paragon P11 CF — Black Glass Liners": [
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
    {
      name: "Beckford Complete Fireplace",
      priceExVat: 749.17,
      description: "Portuguese Limestone — surround, back panel & hearth, 80mm rebate",
    },
  ],
  "Paragon P5 CF — Black Ribbed Liners": [
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
    {
      name: "Wenlock Complete Fireplace for P5",
      priceExVat: 1199.17,
      description: "Portuguese Limestone — surround, back panel & hearth, 80mm rebate",
    },
  ],
  "Paragon P5 CF — Black Glass Liners": [
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
    {
      name: "Wenlock Complete Fireplace for P5",
      priceExVat: 1199.17,
      description: "Portuguese Limestone — surround, back panel & hearth, 80mm rebate",
    },
  ],
  "Paragon P5 BF — Black Ribbed Liners": [
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
    {
      name: "Wenlock Complete Fireplace for P5",
      priceExVat: 1199.17,
      description: "Portuguese Limestone — surround, back panel & hearth, 80mm rebate",
    },
  ],
  "Paragon P5 BF — Black Glass Liners": [
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
    {
      name: "Wenlock Complete Fireplace for P5",
      priceExVat: 1199.17,
      description: "Portuguese Limestone — surround, back panel & hearth, 80mm rebate",
    },
  ],
  "Infinity 890HD CF Mk2": [
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
    {
      name: "Balmoral Complete Fireplace",
      priceExVat: 857.50,
      description: "Portuguese Limestone — surround, back panel & hearth, 80mm rebate",
    },
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
  // ── Stovax & Gazco Freestanding Stoves ───────
  // Huntingdon Stoves
  { brand: "Stovax & Gazco", name: "Huntingdon 20", kw: null, rrp: 1090 },
  { brand: "Stovax & Gazco", name: "Huntingdon 30", kw: null, rrp: 1299 },
  { brand: "Stovax & Gazco", name: "Huntingdon 40", kw: null, rrp: 1549 },
  // Chesterfield Stoves
  { brand: "Stovax & Gazco", name: "Chesterfield 5", kw: null, rrp: 1590 },
  { brand: "Stovax & Gazco", name: "Chesterfield 5 Wide", kw: null, rrp: 1915 },
  // Sheraton Stoves
  { brand: "Stovax & Gazco", name: "Sheraton 5", kw: null, rrp: 1590 },
  { brand: "Stovax & Gazco", name: "Sheraton 5 Wide", kw: null, rrp: 1915 },
  // County Stoves
  { brand: "Stovax & Gazco", name: "County 3", kw: null, rrp: 954 },
  { brand: "Stovax & Gazco", name: "County 5", kw: null, rrp: 1090 },
  { brand: "Stovax & Gazco", name: "County 5 Wide", kw: null, rrp: 1299 },
  { brand: "Stovax & Gazco", name: "County 8", kw: null, rrp: 1504 },
  // Stockton Stoves
  { brand: "Stovax & Gazco", name: "Stockton 3", kw: null, rrp: 1045 },
  { brand: "Stovax & Gazco", name: "Stockton 4", kw: null, rrp: 1195 },
  { brand: "Stovax & Gazco", name: "Stockton 5", kw: null, rrp: 1320 },
  { brand: "Stovax & Gazco", name: "Stockton 5 Wide", kw: null, rrp: 1504 },
  { brand: "Stovax & Gazco", name: "Stockton 8", kw: null, rrp: 1750 },
  { brand: "Stovax & Gazco", name: "Stockton 11", kw: null, rrp: 1962 },
  // Futura Stoves
  { brand: "Stovax & Gazco", name: "Futura 4", kw: null, rrp: 1045 },
  { brand: "Stovax & Gazco", name: "Futura 5", kw: null, rrp: 1195 },
  { brand: "Stovax & Gazco", name: "Futura 8", kw: null, rrp: 1504 },
  // Vogue Stoves
  { brand: "Stovax & Gazco", name: "Vogue Small", kw: null, rrp: 1632 },
  { brand: "Stovax & Gazco", name: "Vogue Small T", kw: null, rrp: 1824 },
  { brand: "Stovax & Gazco", name: "Vogue Midi", kw: null, rrp: 1915 },
  { brand: "Stovax & Gazco", name: "Vogue Midi T", kw: null, rrp: 2079 },
  { brand: "Stovax & Gazco", name: "Vogue Medium", kw: null, rrp: 2345 },
  { brand: "Stovax & Gazco", name: "Vogue Medium Slimline", kw: null, rrp: 2520 },
];

// ─────────────────────────────────────────────
//  GAS FIRE — BALANCED FLUE (BF)
// ─────────────────────────────────────────────
export const GAS_BF_PRODUCTS: GasFireProduct[] = [
  // ── Gazco BF ───────────────────────────────────
  // Riva2 500HL Slimline
  {
    brand: "Gazco",
    name: "Riva2 500HL BF",
    description: "Balanced Flue, Slimline, Manual / Remote Control",
    subCategory: "Gazco Riva2",
    slideControlNg: 2657.00,
    remoteControlNg: 2927.00,
  },
  // Riva2 600
  {
    brand: "Gazco",
    name: "Riva2 600 BF",
    description: "Balanced Flue, Manual / Remote Control",
    subCategory: "Gazco Riva2",
    slideControlNg: 2412.00,
    remoteControlNg: 2682.00,
  },
  // Riva2 750HL
  {
    brand: "Gazco",
    name: "Riva2 750HL BF",
    description: "Balanced Flue, Large, Manual / Remote Control",
    subCategory: "Gazco Riva2",
    slideControlNg: 3099.00,
    remoteControlNg: 3369.00,
  },
  // Studio 1
  {
    brand: "Gazco",
    name: "Studio 1 BF",
    description: "Balanced Flue, Manual / Remote Control",
    subCategory: "Gazco Studio",
    slideControlNg: 2462.00,
    remoteControlNg: 2732.00,
  },
  // Studio 2
  {
    brand: "Gazco",
    name: "Studio 2 BF",
    description: "Balanced Flue, Manual / Remote Control",
    subCategory: "Gazco Studio",
    slideControlNg: 2729.00,
    remoteControlNg: 2999.00,
  },
  // Studio 3
  {
    brand: "Gazco",
    name: "Studio 3 BF",
    description: "Balanced Flue, Manual / Remote Control",
    subCategory: "Gazco Studio",
    slideControlNg: 3629.00,
    remoteControlNg: 3899.00,
  },
  // Studio 1 Slimline
  {
    brand: "Gazco",
    name: "Studio 1 Slimline BF",
    description: "Balanced Flue, Slimline, Manual / Remote Control",
    subCategory: "Gazco Studio",
    slideControlNg: 2570.00,
    remoteControlNg: 2840.00,
  },
  // Studio 2 Slimline
  {
    brand: "Gazco",
    name: "Studio 2 Slimline BF",
    description: "Balanced Flue, Slimline, Manual / Remote Control",
    subCategory: "Gazco Studio",
    slideControlNg: 2924.00,
    remoteControlNg: 3194.00,
  },
  // Studio 2 Duplex (2-sided)
  {
    brand: "Gazco",
    name: "Studio 2 Duplex BF",
    description: "Balanced Flue, 2-sided, Manual / Remote Control",
    subCategory: "Gazco Studio",
    slideControlNg: 4187.00,
    remoteControlNg: 4457.00,
  },
  // ── Onyx BF ───────────────────────────────────
  {
    brand: "Onyx",
    name: "Avanti 65 BF (NG)",
    description: "Balanced Flue, Natural Gas",
    subCategory: "Onyx Fires",
    price: 2704.17, // £3,245 inc VAT ÷ 1.2
  },
  {
    brand: "Onyx",
    name: "Avanti 85 BF (NG)",
    description: "Balanced Flue, Natural Gas",
    subCategory: "Onyx Fires",
    price: 3037.50, // £3,645 inc VAT ÷ 1.2
  },
  {
    brand: "Onyx",
    name: "Avanti 85 BF (LPG)",
    description: "Balanced Flue, LPG",
    subCategory: "Onyx Fires",
    price: 3037.50, // £3,645 inc VAT ÷ 1.2
  },
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
  // ── Gazco CF ───────────────────────────────────
  // Riva2 400
  {
    brand: "Gazco",
    name: "Riva2 400 CF",
    description: "Conventional Flue, Manual / Remote Control",
    subCategory: "Gazco Riva2",
    slideControlNg: 1665.00,
    remoteControlNg: 1935.00,
  },
  // Riva2 500
  {
    brand: "Gazco",
    name: "Riva2 500 CF",
    description: "Conventional Flue, Manual / Remote Control",
    subCategory: "Gazco Riva2",
    slideControlNg: 2062.00,
    remoteControlNg: 2332.00,
  },
  // Riva2 600
  {
    brand: "Gazco",
    name: "Riva2 600 CF",
    description: "Conventional Flue, Manual / Remote Control",
    subCategory: "Gazco Riva2",
    slideControlNg: 2065.00,
    remoteControlNg: 2335.00,
  },
  // Riva2 600HL
  {
    brand: "Gazco",
    name: "Riva2 600HL CF",
    description: "Conventional Flue, Large, Manual / Remote Control",
    subCategory: "Gazco Riva2",
    slideControlNg: 2412.00,
    remoteControlNg: 2682.00,
  },
  // Studio 1
  {
    brand: "Gazco",
    name: "Studio 1 CF",
    description: "Conventional Flue, Manual / Remote Control",
    subCategory: "Gazco Studio",
    slideControlNg: 2212.00,
    remoteControlNg: 2482.00,
  },
  // Studio 2
  {
    brand: "Gazco",
    name: "Studio 2 CF",
    description: "Conventional Flue, Manual / Remote Control",
    subCategory: "Gazco Studio",
    slideControlNg: 2554.00,
    remoteControlNg: 2824.00,
  },
  // ── Onyx CF ───────────────────────────────────
  {
    brand: "Onyx",
    name: "Avanti 65 CF (NG)",
    description: "Conventional Flue, Natural Gas",
    subCategory: "Onyx Fires",
    price: 2495.83, // £2,995 inc VAT ÷ 1.2
  },
  {
    brand: "Onyx",
    name: "Avanti 65 CF (LPG)",
    description: "Conventional Flue, LPG",
    subCategory: "Onyx Fires",
    price: 2495.83,
  },
  {
    brand: "Onyx",
    name: "Avanti 85 CF (NG)",
    description: "Conventional Flue, Natural Gas",
    subCategory: "Onyx Fires",
    price: 2854.17, // £3,425 inc VAT ÷ 1.2
  },
  {
    brand: "Onyx",
    name: "Avanti 85 CF (LPG)",
    description: "Conventional Flue, LPG",
    subCategory: "Onyx Fires",
    price: 2854.17,
  },
  {
    brand: "Onyx",
    name: "Eclipse 60HL CF (NG)",
    description: "Conventional Flue, Natural Gas",
    subCategory: "Onyx Fires",
    price: 2495.83, // £2,995 inc VAT ÷ 1.2
  },
  {
    brand: "Onyx",
    name: "Eclipse 60HL CF (LPG)",
    description: "Conventional Flue, LPG",
    subCategory: "Onyx Fires",
    price: 2495.83,
  },
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
  // ── Onyx Gas Stoves ──────────────────────────
  { brand: "Onyx", name: "Liv 3 CF (NG)",  fuel: "Natural Gas (CF)",   priceExVat: 2790.83 }, // £3,349 inc VAT ÷ 1.2
  { brand: "Onyx", name: "Liv 3 CF (LPG)", fuel: "LPG (CF)",           priceExVat: 2790.83 },
  { brand: "Onyx", name: "Liv 3 BF (NG)",  fuel: "Natural Gas (BF)",   priceExVat: 2979.17 }, // £3,575 inc VAT ÷ 1.2
  { brand: "Onyx", name: "Liv 3 BF (LPG)", fuel: "LPG (BF)",           priceExVat: 2979.17 },
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
  // ── 3D Ecoflame 16" (A-0635) ─────────────────────────────
  { name: "3D Ecoflame 16\" Engine Only", description: "Engine only, fascia sold separately", priceExVat: 335.00 },
  { name: "3D Ecoflame 16\" — Elite Satin/Black Fascia", description: "Complete with Elite fascia", priceExVat: 420.00 },
  { name: "3D Ecoflame 16\" — Elite Chrome/Black Fascia", description: "Complete with Elite fascia", priceExVat: 420.00 },
  { name: "3D Ecoflame 16\" — Elite Brass/Black Fascia", description: "Complete with Elite fascia", priceExVat: 420.00 },
  { name: "3D Ecoflame 16\" — Elite Chrome/Chrome Fascia", description: "Complete with Elite fascia", priceExVat: 420.00 },
  { name: "3D Ecoflame 16\" — Prestige Nickel/Chrome Fascia", description: "Complete with Prestige fascia", priceExVat: 425.00 },
  { name: "3D Ecoflame 16\" — Prestige Nickel/Black Fascia", description: "Complete with Prestige fascia", priceExVat: 425.00 },
  { name: "3D Ecoflame 16\" — Cast Arch Fascia Black", description: "Complete with Cast Arch fascia", priceExVat: 507.50 },
  { name: "3D Ecoflame 16\" — Cast Arch Fascia Chrome", description: "Complete with Cast Arch fascia", priceExVat: 507.50 },
  { name: "3D Ecoflame 16\" — Cast Arch Fascia Brass", description: "Complete with Cast Arch fascia", priceExVat: 507.50 },
  { name: "3D Ecoflame 16\" — Square Cast Fascia Pewter", description: "Complete with Square Cast fascia", priceExVat: 628.33 },
  { name: "3D Ecoflame 16\" — Square Cast Fascia Brass", description: "Complete with Square Cast fascia", priceExVat: 628.33 },
  { name: "3D Ecoflame 16\" — Square Cast Fascia Gun Metal", description: "Complete with Square Cast fascia", priceExVat: 628.33 },
  // ── 4D Ecoflame 16" (A-0710) ─────────────────────────────
  { name: "4D Ecoflame 16\" Engine Only", description: "Engine only, fascia sold separately", priceExVat: 379.17 },
  { name: "4D Ecoflame 16\" — Elite Satin/Black Fascia", description: "Complete with Elite fascia", priceExVat: 455.00 },
  { name: "4D Ecoflame 16\" — Elite Chrome/Black Fascia", description: "Complete with Elite fascia", priceExVat: 455.00 },
  { name: "4D Ecoflame 16\" — Elite Brass/Black Fascia", description: "Complete with Elite fascia", priceExVat: 455.00 },
  { name: "4D Ecoflame 16\" — Elite Chrome/Chrome Fascia", description: "Complete with Elite fascia", priceExVat: 455.00 },
  { name: "4D Ecoflame 16\" — Prestige Nickel/Chrome Fascia", description: "Complete with Prestige fascia", priceExVat: 457.50 },
  { name: "4D Ecoflame 16\" — Prestige Nickel/Black Fascia", description: "Complete with Prestige fascia", priceExVat: 457.50 },
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
  // ── 4D Ecoflame 22" Maxi (A-1070) — fits 16" or 22" openings ──
  { name: "4D Ecoflame 22\" Maxi — Engine Only", description: "Fits standard 16\" or 22\" wide opening; fascia sold separately", priceExVat: 499.17 },
  { name: "4D Ecoflame 22\" Maxi — Eclipse Fascia Black/Nickel Black", description: "Fascia only for 22\" Maxi engine", priceExVat: 165.83 },
  { name: "4D Ecoflame 22\" Maxi — Eclipse Fascia Chrome/Nickel Black", description: "Fascia only for 22\" Maxi engine", priceExVat: 165.83 },
  // ── Opulus Real Flame Technology 16" (A-1029) ─────────────
  { name: "Opulus 16\" RFT Engine Only", description: "Real Flame Technology, engine only", priceExVat: 832.50 },
  { name: "Opulus 16\" RFT — Prestige Nickel/Chrome Fascia", description: "Complete with Prestige fascia", priceExVat: 957.50 },
  { name: "Opulus 16\" RFT — Prestige Nickel/Black Fascia", description: "Complete with Prestige fascia", priceExVat: 957.50 },
  { name: "Opulus 16\" RFT — Elite Brass/Black Fascia", description: "Complete with Elite fascia", priceExVat: 957.50 },
  { name: "Opulus 16\" RFT — Elite Chrome/Black Fascia", description: "Complete with Elite fascia", priceExVat: 957.50 },
  { name: "Opulus 16\" RFT — Elite Satin/Black Fascia", description: "Complete with Elite fascia", priceExVat: 957.50 },
  { name: "Opulus 16\" RFT — Elite Chrome/Chrome Fascia", description: "Complete with Elite fascia", priceExVat: 957.50 },
  // ── Electric Stoves ───────────────────────────────────────
  { name: "Electric Stove — Curved Door", description: "Electric stove, curved door style", priceExVat: 882.50 },
  { name: "Electric Stove — Square Door", description: "Electric stove, square door style", priceExVat: 882.50 },
  { name: "Alcaston Electric Stove — Tracery Door", description: "Alcaston electric stove, tracery door", priceExVat: 882.50 },
];

// ─────────────────────────────────────────────
//  TRIM OPTIONS FOR STANDALONE 16" ELECTRIC FIRE ENGINES
//  (3D Ecoflame, 4D Ecoflame, Opulus — engine-only purchases)
//  Prices ex VAT from C&J Gas Fire Price List Oct 2025
// ─────────────────────────────────────────────

export interface CJ16TrimOption {
  name: string;
  priceExVat: number;
  category: "Boxed Trim" | "Prestige Fascia" | "Fret";
}

/**
 * Standalone fascias/trims/frets sold separately for 16" fire engines.
 * Shown when an engine-only product is selected to let the user add a trim.
 */
export const CJ_16_INCH_TRIM_OPTIONS: CJ16TrimOption[] = [
  // ── Boxed Standard Trims ─────────────────────────────────
  { name: "Boxed Trim — Brass",         category: "Boxed Trim",    priceExVat: 70.83 },
  { name: "Boxed Trim — Black",         category: "Boxed Trim",    priceExVat: 70.83 },
  { name: "Boxed Trim — Chrome",        category: "Boxed Trim",    priceExVat: 70.83 },
  { name: "Boxed Trim — Brushed Steel", category: "Boxed Trim",    priceExVat: 70.83 },
  // ── Prestige Fascias (standalone) ────────────────────────
  { name: "Prestige Fascia — Nickel/Chrome", category: "Prestige Fascia", priceExVat: 140.83 },
  { name: "Prestige Fascia — Nickel/Black",  category: "Prestige Fascia", priceExVat: 140.83 },
  // ── Frets ────────────────────────────────────────────────
  { name: "Wellington Fret — Brass",             category: "Fret", priceExVat: 100.00 },
  { name: "Wellington Fret — Antique",            category: "Fret", priceExVat: 105.00 },
  { name: "Bayswater Fret — Brass",              category: "Fret", priceExVat: 105.00 },
  { name: "Bayswater Fret — Chrome",             category: "Fret", priceExVat: 105.00 },
  { name: "Gate Cast Iron Fret — Black",         category: "Fret", priceExVat:  75.00 },
  { name: "Gate Cast Iron Fret — Brass",         category: "Fret", priceExVat: 107.50 },
  { name: "Gate Cast Iron Fret — Chrome",        category: "Fret", priceExVat: 107.50 },
  { name: "Gate Cast Iron Fret — Brushed Steel", category: "Fret", priceExVat: 107.50 },
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
  {
    tabName: "Maxi 22\"",
    products: [
      // Engine only — fits both standard 16" and 22" wide openings
      { name: "4D Ecoflame 22\" Maxi — Engine Only",                             widthMm: 560, priceExVat: 499.17 },
      // Engine + Eclipse fascia bundles (engine £499.17 + fascia £165.83)
      { name: "4D Ecoflame 22\" Maxi + Eclipse Fascia Black/Nickel Black",       widthMm: 560, priceExVat: 665.00 },
      { name: "4D Ecoflame 22\" Maxi + Eclipse Fascia Chrome/Nickel Black",      widthMm: 560, priceExVat: 665.00 },
    ],
    realLogsUpgrade: { label: "Real Oak Premium Log Set — 7 logs (Maxi)", price: 74.17 },
    note: "Engine fits standard 16\" or 22\" wide opening. Eclipse fascias sold separately (£165.83 each) or as package above.",
  },
];
