export interface CatalogItem {
  label: string;
  price: number;
  kw?: string;
}

export interface FireCatalogItem extends CatalogItem {
  brand: string;
  model: string;
}

export const FIRE_OPTIONS: FireCatalogItem[] = [
  { label: "Chesneys The Alpine 4kW", brand: "Chesneys", model: "The Alpine 4kW", kw: "4", price: 1799 },
  { label: "Chesneys The Salisbury 4kW", brand: "Chesneys", model: "The Salisbury 4kW", kw: "4", price: 1399 },
  { label: "Chesneys The Salisbury 5kW", brand: "Chesneys", model: "The Salisbury 5kW", kw: "5", price: 1719 },
  { label: "Chesneys The Salisbury 5kW LS", brand: "Chesneys", model: "The Salisbury 5kW LS", kw: "5", price: 1819 },
  { label: "Chesneys The Salisbury 8kW", brand: "Chesneys", model: "The Salisbury 8kW", kw: "8", price: 2149 },
  { label: "Chesneys The Salisbury 8kW Double-Sided", brand: "Chesneys", model: "The Salisbury 8kW Double-Sided", kw: "8", price: 2589 },
  { label: "Chesneys The Salisbury 12kW", brand: "Chesneys", model: "The Salisbury 12kW", kw: "12", price: 2799 },
  { label: "Chesneys The Beaumont 4kW", brand: "Chesneys", model: "The Beaumont 4kW", kw: "4", price: 1529 },
  { label: "Chesneys The Beaumont 5kW", brand: "Chesneys", model: "The Beaumont 5kW", kw: "5", price: 1999 },
  { label: "Chesneys The Beaumont 8kW", brand: "Chesneys", model: "The Beaumont 8kW", kw: "8", price: 2259 },
  { label: "Chesneys The Shoreditch 4kW", brand: "Chesneys", model: "The Shoreditch 4kW", kw: "4", price: 1529 },
  { label: "Chesneys The Shoreditch 5kW", brand: "Chesneys", model: "The Shoreditch 5kW", kw: "5", price: 1819 },
  { label: "Chesneys The Shoreditch 5kW LS", brand: "Chesneys", model: "The Shoreditch 5kW LS", kw: "5", price: 1889 },
  { label: "Chesneys The Shoreditch 8kW", brand: "Chesneys", model: "The Shoreditch 8kW", kw: "8", price: 2389 },
  { label: "Chesneys The Sanctuary 5kW", brand: "Chesneys", model: "The Sanctuary 5kW", kw: "5", price: 1759 },
  { label: "Chesneys The Sanctuary 5kW LS", brand: "Chesneys", model: "The Sanctuary 5kW LS", kw: "5", price: 1829 },
  { label: "Chesneys The Serendipity 5kW", brand: "Chesneys", model: "The Serendipity 5kW", kw: "5", price: 1819 },
  { label: "Chesneys The Serendipity 5kW LS", brand: "Chesneys", model: "The Serendipity 5kW LS", kw: "5", price: 1889 },
  { label: "Chesneys The Solstice 5kW LS Low Base", brand: "Chesneys", model: "The Solstice 5kW LS Low Base", kw: "5", price: 2369 },
  { label: "Chesneys The Solstice 5kW LS Standard", brand: "Chesneys", model: "The Solstice 5kW LS Standard", kw: "5", price: 2469 },
  { label: "Chesneys The Solstice 5kW Pedestal", brand: "Chesneys", model: "The Solstice 5kW Pedestal", kw: "5", price: 2569 },
  { label: "Westleigh 5 Slimline Single Door", brand: "Westleigh", model: "Westleigh 5 Slimline Single Door", kw: "5", price: 1569 },
  { label: "Westleigh 5 Slimline Double Door", brand: "Westleigh", model: "Westleigh 5 Slimline Double Door", kw: "5", price: 1569 },
  { label: "Isca 4", brand: "Isca", model: "Isca 4", kw: "4", price: 1399 },
  { label: "Isca 5", brand: "Isca", model: "Isca 5", kw: "5", price: 1499 },
  { label: "Isca 7", brand: "Isca", model: "Isca 7", kw: "7", price: 1789 },
  { label: "Capital Avebury", brand: "Capital", model: "Avebury", kw: "5", price: 649 },
  { label: "Capital Bassington", brand: "Capital", model: "Bassington", kw: "5", price: 649 },
  { label: "Capital Bassington Baseline", brand: "Capital", model: "Bassington Baseline", kw: "5", price: 649 },
  { label: "Capital Bassington Skirted", brand: "Capital", model: "Bassington Skirted", kw: "5", price: 649 },
  { label: "Capital Bassington Grande Log Store", brand: "Capital", model: "Bassington Grande Log Store", kw: "5", price: 734 },
  { label: "Capital Bassington Compact", brand: "Capital", model: "Bassington Compact", kw: "5", price: 515 },
  { label: "Capital Bassington Compact Baseline", brand: "Capital", model: "Bassington Compact Baseline", kw: "5", price: 515 },
  { label: "Capital Bassington Compact Skirted", brand: "Capital", model: "Bassington Compact Skirted", kw: "5", price: 515 },
  { label: "Capital Holsworthy 5 Cylindrical", brand: "Capital", model: "Holsworthy 5 Cylindrical", kw: "5", price: 1099 },
  { label: "Capital Panamera", brand: "Capital", model: "Panamera", kw: "5", price: 630 },
  { label: "Capital Panamera Prime", brand: "Capital", model: "Panamera Prime", kw: "5", price: 670 },
  { label: "Capital Panamera Supreme", brand: "Capital", model: "Panamera Supreme", kw: "5", price: 695 },
  { label: "Capital Ridgmont 5", brand: "Capital", model: "Ridgmont 5", kw: "5", price: 515 },
  { label: "Capital Savona Inset", brand: "Capital", model: "Savona Inset", kw: "5", price: 615 },
  { label: "Capital Scene", brand: "Capital", model: "Scene", kw: "5", price: 679 },
  { label: "Capital Sigma", brand: "Capital", model: "Sigma", kw: "5", price: 679 },
  { label: "Capital Vega Edge 200SL", brand: "Capital", model: "Vega Edge 200SL", kw: "5", price: 649 },
  { label: "Capital Verena", brand: "Capital", model: "Verena", kw: "5", price: 395 },
  { label: "Capital Verena Prime", brand: "Capital", model: "Verena Prime", kw: "5", price: 435 },
  { label: "Capital Verena Supreme", brand: "Capital", model: "Verena Supreme", kw: "5", price: 460 },
  { label: "Capital Woodrow 4", brand: "Capital", model: "Woodrow 4", kw: "4", price: 410 },
  { label: "Capital Woodrow 5", brand: "Capital", model: "Woodrow 5", kw: "5", price: 515 },
  { label: "Capital Woodrow 5 Quad", brand: "Capital", model: "Woodrow 5 Quad", kw: "5", price: 515 },
];

export interface CapitalHearthProduct {
  name: string;
  price: number;
}

export interface CapitalHearthType {
  type: string;
  products: CapitalHearthProduct[];
}

export interface CapitalHearthCategory {
  material: string;
  types: CapitalHearthType[];
}

export const CAPITAL_HEARTHS: CapitalHearthCategory[] = [
  {
    material: "Granite",
    types: [
      {
        type: "Boxed & Lipped",
        products: [
          { name: '36" x 15" Polished', price: 77 },
          { name: '36" x 15" Honed', price: 119 },
          { name: '48" x 15" Polished', price: 143 },
          { name: '48" x 15" Honed', price: 87 },
          { name: '51" x 15" Polished', price: 160 },
          { name: '51" x 15" Honed', price: 99 },
          { name: '54" x 15" Polished', price: 154 },
          { name: '54" x 15" Honed', price: 98 },
          { name: '54" x 18" Polished', price: 180 },
          { name: '54" x 18" Honed', price: 139 },
          { name: '56" x 15" Honed', price: 139 },
          { name: '59" x 15" Honed', price: 153 },
          { name: '60" x 18" Polished', price: 149 },
        ],
      },
      {
        type: "Flat Back Hearths",
        products: [
          { name: '30" x 6" Push-Under Polished', price: 28 },
          { name: '32" x 15" Standard Polished', price: 71 },
          { name: '32" x 15" Standard Honed', price: 51 },
          { name: '38" x 15" Large Polished', price: 77 },
          { name: '38" x 15" Large Honed', price: 57 },
          { name: '36" x 18" Polished', price: 75 },
          { name: '36" x 24" Freestanding Polished', price: 108 },
          { name: '36" x 24" Freestanding Honed', price: 82 },
          { name: '37" x 37" Freestanding Honed', price: 150 },
          { name: '48" x 18" Honed', price: 83 },
          { name: '54" x 18" Honed', price: 98 },
          { name: '60" x 20" Honed', price: 119 },
        ],
      },
      {
        type: "Slabbed (Solid Fuel)",
        products: [
          { name: '48" x 15" Polished', price: 140 },
          { name: '48" x 18" Polished', price: 155 },
          { name: '54" x 15" Polished', price: 145 },
          { name: '54" x 18" Polished', price: 160 },
          { name: '56" x 18" Polished', price: 180 },
        ],
      },
    ],
  },
  {
    material: "Slate",
    types: [
      {
        type: "Graphite Riven",
        products: [
          { name: '32" x 15" Standard Back', price: 51 },
          { name: '38" x 15" Large Back', price: 57 },
          { name: '36" x 24" Freestanding', price: 82 },
          { name: '37" x 37" Freestanding', price: 150 },
          { name: '48" x 18"', price: 83 },
          { name: '54" x 18"', price: 98 },
          { name: '60" x 20"', price: 119 },
        ],
      },
      {
        type: "Antique Riven",
        products: [
          { name: '36" x 24" Freestanding', price: 82 },
          { name: '37" x 37" Freestanding', price: 150 },
        ],
      },
    ],
  },
  {
    material: "Glass",
    types: [
      {
        type: "Teardrop",
        products: [
          { name: "1100mm x 1100mm Teardrop Smoked", price: 91 },
          { name: "1100mm x 1100mm Teardrop Transparent", price: 81 },
        ],
      },
      {
        type: "Circle",
        products: [
          { name: "1100mm x 1100mm Circle Smoked", price: 81 },
          { name: "1100mm x 1100mm Circle Transparent", price: 71 },
        ],
      },
      {
        type: "Quadrant",
        products: [
          { name: "1200mm x 1200mm Quadrant Smoked", price: 101 },
          { name: "1200mm x 1200mm Quadrant Transparent", price: 91 },
        ],
      },
      {
        type: "Semi-Circle",
        products: [
          { name: "1100mm x 850mm Semi-Circle Smoked", price: 71 },
          { name: "1100mm x 850mm Semi-Circle Transparent", price: 61 },
        ],
      },
      {
        type: "Truncated",
        products: [
          { name: "1100mm x 950mm Truncated Smoked", price: 81 },
          { name: "1100mm x 950mm Truncated Transparent", price: 71 },
        ],
      },
      {
        type: "Square",
        products: [
          { name: "900mm x 900mm Square Smoked", price: 71 },
          { name: "900mm x 900mm Square Transparent", price: 61 },
        ],
      },
    ],
  },
];

export const BEAM_OPTIONS: (CatalogItem & { material: string })[] = [
  { label: 'Solid Oak Beam 48"', material: "Solid Oak", price: 295 },
  { label: 'Solid Oak Beam 54"', material: "Solid Oak", price: 325 },
  { label: 'Reclaimed Oak Beam 48"', material: "Reclaimed Oak", price: 395 },
  { label: 'Stone Effect Beam 48"', material: "Stone Effect", price: 195 },
  { label: 'Slate Beam 48"', material: "Slate", price: 250 },
];

export interface ChamberBoardVariant {
  name: string;
  price: number;
}

export const CHAMBER_BOARD_VARIANTS: ChamberBoardVariant[] = [
  { name: "ANDALUSIA*", price: 310 },
  { name: "POMPEII", price: 250 },
  { name: "ANTHRACITE*", price: 360 },
  { name: "PORTUGUESE LIMESTONE*", price: 360 },
  { name: "BRAZILIAN ANTIQUE RIVEN SLATE", price: 245 },
  { name: "RAINBOW", price: 250 },
  { name: "CHARCOAL GREY WATERFALL*", price: 310 },
  { name: "RIVEN SLATE", price: 250 },
  { name: "COBBLED RED", price: 250 },
  { name: "RUSTIC", price: 250 },
  { name: "CORINTHIAN STONE", price: 250 },
  { name: "RUSTIC HERRINGBONE", price: 250 },
  { name: "COSMIC BLACK QUARTZ*", price: 310 },
  { name: "RUSTIC RIVEN STAGGERED*", price: 310 },
  { name: "DOVE GREY*", price: 310 },
  { name: "RUSTY SLATE", price: 250 },
  { name: "FROSTED ICED GREY*", price: 310 },
  { name: "SANTIAGO*", price: 310 },
  { name: "FROSTED ICED GREY HERRINGBONE*", price: 360 },
  { name: "SILVER GREY QUARTZ*", price: 310 },
  { name: "GRAPHITE RIVEN SLATE", price: 250 },
  { name: "SMOKE GREY*", price: 360 },
  { name: "GREY BRICK BOND MONTAGE", price: 310 },
  { name: "STORM GREY*", price: 360 },
  { name: "GREY BRUSHED SLATE", price: 250 },
  { name: "SUNSET RED*", price: 360 },
  { name: "GREY HERRINGBONE", price: 360 },
  { name: "TRAVARK GREY*", price: 310 },
  { name: "LUCENA*", price: 310 },
  { name: "TRAVERK WHITE*", price: 310 },
  { name: "LUME BLUE*", price: 360 },
  { name: "URBAN DUSK", price: 310 },
  { name: "NAVARRA*", price: 310 },
  { name: "URBAN DUSK HERRINGBONE", price: 360 },
  { name: "OLIVE WATERFALL*", price: 310 },
  { name: "ZAMORA*", price: 310 },
  { name: "OYSTER SLATE*", price: 310 },
  { name: "FERMACELL BOARD (2x)", price: 87 },
];

export const CHAMBER_BOARD_NOTE = "*Made to order. Allow up to 4 weeks. Minimum clearance distances apply. Chamber sizes vary between designs.";

export const REEDED_PANELS_PRICE = 365;
export const CHAMBER_TRIM_KIT_PRICE = 99;
export const FERMACELL_BOARD_PRICE = 43.5;
