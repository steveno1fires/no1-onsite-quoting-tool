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
  { label: "Gazco Huntingdon 30", brand: "Gazco", model: "Huntingdon 30", kw: "4.7", price: 1399 },
  { label: "Gazco Studio 1 Gas", brand: "Gazco", model: "Studio 1 Gas", kw: "5.3", price: 1899 },
  { label: "Gazco eReflex 70W", brand: "Gazco", model: "eReflex 70W", price: 2199 },
  { label: "Celsi Electriflame VR", brand: "Celsi", model: "Electriflame VR", price: 649 },
  { label: "Dimplex Opti-Myst Pro", brand: "Dimplex", model: "Opti-Myst Pro", price: 1299 },
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
        type: "Boxed & Lipped - Polished or Honed",
        products: [
          { name: '36" x 15" Granite Boxed & Lipped', price: 119 },
          { name: '48" x 15" Granite Boxed & Lipped', price: 129 },
          { name: '51" x 15" Granite Boxed & Lipped', price: 160 },
          { name: '54" x 15" Granite Boxed & Lipped', price: 139 },
          { name: '54" x 18" Granite Boxed & Lipped (Polished Only)', price: 180 },
        ],
      },
      {
        type: "Flat Hearths",
        products: [
          { name: 'Push-Under Back Hearth (30" x 6")', price: 28 },
          { name: 'Standard Back Hearth (32" x 15")', price: 71 },
          { name: 'Large Back Hearth (38" x 15")', price: 77 },
          { name: '36" x 18" Granite Flat Hearth', price: 75 },
          { name: '36" x 24" Granite Flat Hearth (4-Sided)', price: 108 },
          { name: '37" x 37" Granite Flat Hearth (4-Sided)', price: 150 },
          { name: '48" x 18" Granite Flat Hearth', price: 105 },
          { name: '54" x 18" Granite Flat Hearth', price: 134 },
          { name: '60" x 20" Granite Flat Hearth', price: 144 },
        ],
      },
      {
        type: "Slabbed Granite Hearths",
        products: [
          { name: '48" x 15" Slabbed Granite', price: 140 },
          { name: '48" x 18" Slabbed Granite', price: 155 },
          { name: '54" x 15" Slabbed Granite', price: 145 },
          { name: '54" x 18" Slabbed Granite', price: 160 },
          { name: '56" x 18" Slabbed Granite (Polished Only)', price: 180 },
        ],
      },
      {
        type: "Back Panels",
        products: [
          { name: '37" x 37" Granite Back Panel (Standard Cut Out)', price: 139 },
          { name: '37" x 37" Granite Back Panel (No Cut Out)', price: 139 },
        ],
      },
      {
        type: "Pearl Grey Granite",
        products: [
          { name: 'Standard Back Hearth (32" x 15") Pearl Grey', price: 80 },
          { name: 'Large Back Hearth (38" x 15") Pearl Grey', price: 85 },
          { name: '36" x 24" Pearl Grey Hearth (4-Sided)', price: 120 },
          { name: '37" x 37" Pearl Grey Hearth (4-Sided)', price: 175 },
          { name: '37" x 37" Pearl Grey Back Panel', price: 160 },
          { name: '48" x 18" Pearl Grey Flat Hearth', price: 119 },
        ],
      },
    ],
  },
  {
    material: "Slate",
    types: [
      {
        type: "Boxed & Lipped - Graphite Riven/Grey Brushed/Honed",
        products: [
          { name: '36" x 15" Slate Boxed & Lipped', price: 87 },
          { name: '48" x 15" Slate Boxed & Lipped', price: 87 },
          { name: '51" x 15" Slate Boxed & Lipped', price: 99 },
          { name: '54" x 15" Slate Boxed & Lipped', price: 139 },
          { name: '54" x 18" Slate Boxed & Lipped (Honed Only)', price: 139 },
          { name: '56" x 15" Slate Boxed & Lipped (Honed Only)', price: 139 },
          { name: '59" x 15" Slate Boxed & Lipped', price: 153 },
          { name: '60" x 18" Slate Boxed & Lipped (Polished Only)', price: 149 },
        ],
      },
      {
        type: "Brazilian Slate - Graphite/Antique Riven",
        products: [
          { name: 'Standard Back Hearth (32" x 15") Brazilian Slate', price: 51 },
          { name: 'Large Back Hearth (38" x 15") Brazilian Slate', price: 57 },
          { name: '36" x 24" Brazilian Slate Hearth (4-Sided)', price: 82 },
          { name: '37" x 37" Brazilian Slate Hearth (4-Sided)', price: 150 },
          { name: '48" x 18" Brazilian Slate Flat Hearth', price: 83 },
          { name: '54" x 18" Brazilian Slate Flat Hearth', price: 98 },
          { name: '60" x 20" Brazilian Slate Flat Hearth (Riven Only)', price: 119 },
          { name: '36" x 15" Brazilian Slate Boxed & Lipped', price: 119 },
          { name: '48" x 15" Brazilian Slate Boxed & Lipped', price: 129 },
          { name: '54" x 15" Brazilian Slate Boxed & Lipped', price: 140 },
        ],
      },
      {
        type: "Limestone Hearths",
        products: [
          { name: 'Aegean Limestone Back Hearth (32" x 15")', price: 77 },
          { name: 'Aegean Limestone Large Back Hearth (38" x 15")', price: 81 },
          { name: 'Aegean Limestone Boxed & Lipped 48" x 15"', price: 110 },
          { name: 'Aegean Limestone Boxed & Lipped 54" x 15"', price: 114 },
          { name: 'Aegean Limestone Boxed & Lipped 59" x 15"', price: 121 },
          { name: 'Aegean Limestone Flat 48" x 20"', price: 115 },
          { name: 'Aegean Limestone Flat 60" x 20"', price: 152 },
          { name: 'Portuguese Limestone Boxed Flush 42"/48"/54" x 15"', price: 62 },
          { name: 'Portuguese Limestone Curved 48" x 13"', price: 77 },
          { name: 'Portuguese Limestone Back Hearth (32" x 15")', price: 71 },
          { name: 'Portuguese Limestone Flat 48" x 20"', price: 113 },
          { name: 'Portuguese Limestone Flat 60" x 20"', price: 149 },
        ],
      },
    ],
  },
  {
    material: "Glass",
    types: [
      {
        type: "Light Duty Glass Hearths - Smoked/Transparent",
        products: [
          { name: "1100mm x 950mm Truncated Glass (Smoked)", price: 81 },
          { name: "1100mm x 950mm Truncated Glass (Transparent)", price: 71 },
          { name: "1100mm x 1100mm Tear Drop Glass (Smoked)", price: 91 },
          { name: "1100mm x 1100mm Tear Drop Glass (Transparent)", price: 81 },
          { name: "1200mm x 1200mm Quadrant Glass (Smoked)", price: 101 },
          { name: "1200mm x 1200mm Quadrant Glass (Transparent)", price: 91 },
          { name: "1100mm x 850mm Semi-Circle Glass (Smoked)", price: 71 },
          { name: "1100mm x 850mm Semi-Circle Glass (Transparent)", price: 61 },
          { name: "900mm x 900mm Square Glass (Smoked)", price: 71 },
          { name: "900mm x 900mm Square Glass (Transparent)", price: 61 },
          { name: "1100mm x 1100mm Circular Glass (Smoked)", price: 81 },
          { name: "1100mm x 1100mm Circular Glass (Transparent)", price: 71 },
        ],
      },
    ],
  },
  {
    material: "Special Shapes",
    types: [
      {
        type: "Granite Slip Sets - Standard Sizes",
        products: [
          { name: "Size One Granite Slip Set (Basket Opening)", price: 129 },
          { name: "Size Two Granite Slip Set (Inset Opening)", price: 129 },
          { name: "Size Three Granite Slip Set (Stove Opening)", price: 129 },
        ],
      },
      {
        type: "Stone Slip Sets",
        products: [
          { name: 'Aegean Limestone Slip Set Size Two (16" x 22")', price: 131 },
          { name: "Corinthian Stone Small Slip Set", price: 133 },
          { name: "Corinthian Stone Large Slip Set", price: 133 },
          { name: "Corinthian Stone Stove Slip Set", price: 118 },
        ],
      },
      {
        type: "Farmhouse Stone Hearths - Complete",
        products: [
          { name: '42" x 15" Farmhouse Stone Hearth', price: 49 },
          { name: '48" x 15" Farmhouse Stone Hearth', price: 59 },
          { name: '51" x 15" Farmhouse Stone Hearth', price: 61 },
          { name: '54" x 15" Farmhouse Stone Hearth', price: 63 },
        ],
      },
      {
        type: "Corinthian Stone Special Shapes",
        products: [
          { name: '48" x 15" Corinthian Stone Boxed Flush', price: 62 },
          { name: '54" x 15" Corinthian Stone Boxed Flush', price: 62 },
          { name: '48" x 13" Corinthian Stone Curved Hearth', price: 77 },
        ],
      },
    ],
  },
];

export const HEARTH_OPTIONS: CatalogItem[] = [
  { label: "Natural Slate", price: 195 },
  { label: "Polished Granite – Black", price: 275 },
  { label: "Polished Granite – Grey", price: 295 },
  { label: "Honed Sandstone", price: 225 },
  { label: "Glass Hearth – Clear", price: 175 },
  { label: "Glass Hearth – Smoked", price: 195 },
  { label: "Tiled Hearth", price: 150 },
];

export const CHAMBER_OPTIONS: (CatalogItem & { size: string })[] = [
  { label: "Brick Chamber 36×36", size: "36x36", price: 350 },
  { label: "Brick Chamber 40×40", size: "40x40", price: 395 },
  { label: "Vermiculite Chamber 36×36", size: "36x36", price: 295 },
  { label: "Vermiculite Chamber 40×40", size: "40x40", price: 325 },
  { label: "Reeded Chamber 36×36", size: "36x36", price: 375 },
  { label: "Slate Chamber 36×36", size: "36x36", price: 425 },
];

export const BEAM_OPTIONS: (CatalogItem & { material: string })[] = [
  { label: 'Solid Oak Beam 48"', material: "Solid Oak", price: 295 },
  { label: 'Solid Oak Beam 54"', material: "Solid Oak", price: 325 },
  { label: 'Reclaimed Oak Beam 48"', material: "Reclaimed Oak", price: 395 },
  { label: 'Stone Effect Beam 48"', material: "Stone Effect", price: 195 },
  { label: 'Slate Beam 48"', material: "Slate", price: 250 },
];
