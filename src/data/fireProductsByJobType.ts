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
  // Gas Stoves (BF)
  {
    name: "Paragon Edge BF Gas Stove NG (With Snorkel Flue)",
    description: "",
    subCategory: "Gas Stoves (BF)",
    price: 1974.17,
  },
  {
    name: "Paragon Edge BF Gas Stove NG (With Top Vent Kit)",
    description: "",
    subCategory: "Gas Stoves (BF)",
    price: 1974.17,
  },
  {
    name: "Paragon Edge 3-Sided BF Gas Stove NG (With Snorkel Flue)",
    description: "",
    subCategory: "Gas Stoves (BF)",
    price: 2190.83,
  },
  {
    name: "Paragon Edge 3-Sided BF Gas Stove NG (With Top Vent Kit)",
    description: "",
    subCategory: "Gas Stoves (BF)",
    price: 2190.83,
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
  { name: "Paragon Edge Conventional Flue NG", fuel: "Natural Gas", priceExVat: 1499.17 },
  { name: "Paragon Edge Conventional Flue LPG", fuel: "LPG", priceExVat: 1499.17 },
  { name: "Paragon Edge CF NG with Vermiculite Liners", fuel: "Natural Gas", priceExVat: 1457.50 },
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
