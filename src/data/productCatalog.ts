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
  { label: "Stovax Vogue Midi", brand: "Stovax", model: "Vogue Midi", kw: "5", price: 1295 },
  { label: "Stovax Stockton 5", brand: "Stovax", model: "Stockton 5", kw: "5", price: 899 },
  { label: "Stovax Riva Studio 1", brand: "Stovax", model: "Riva Studio 1", kw: "5", price: 1549 },
  { label: "ACR Ashdale 7kW", brand: "ACR", model: "Ashdale", kw: "7", price: 1099 },
  { label: "Burley Fireball 9105", brand: "Burley", model: "Fireball 9105", kw: "3", price: 749 },
  { label: "Gazco Huntingdon 30", brand: "Gazco", model: "Huntingdon 30", kw: "4.7", price: 1399 },
  { label: "Gazco Studio 1 Gas", brand: "Gazco", model: "Studio 1 Gas", kw: "5.3", price: 1899 },
  { label: "Gazco eReflex 70W", brand: "Gazco", model: "eReflex 70W", price: 2199 },
  { label: "Celsi Electriflame VR", brand: "Celsi", model: "Electriflame VR", price: 649 },
  { label: "Dimplex Opti-Myst Pro", brand: "Dimplex", model: "Opti-Myst Pro", price: 1299 },
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

export interface SurroundCatalogItem extends CatalogItem {
  brand: string;
  model: string;
}

export interface WoodburnerCatalogItem extends CatalogItem {
  brand: string;
  model: string;
}

export const WOODBURNER_OPTIONS: WoodburnerCatalogItem[] = [
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
  { label: "Capital Atmos 105R", brand: "Capital", model: "Atmos 105R", price: 695 },
  { label: "Capital Atmos 135R", brand: "Capital", model: "Atmos 135R", price: 795 },
  { label: "Capital Atmos 165R", brand: "Capital", model: "Atmos 165R", price: 895 },
  { label: "Capital Atmos 195R", brand: "Capital", model: "Atmos 195R", price: 995 },
  { label: "Capital Atlas 1 Single Window", brand: "Capital", model: "Atlas 1 Single Window", kw: "5", price: 1495 },
  { label: "Capital Atlas 2 Side Windows", brand: "Capital", model: "Atlas 2 Side Windows", kw: "6", price: 1695 },
  { label: "Capital Atlas 3 Side Windows", brand: "Capital", model: "Atlas 3 Side Windows", kw: "6", price: 1995 },
];

export const SURROUND_OPTIONS: SurroundCatalogItem[] = [
  { label: "Cast Iron Insert", brand: "Cast Iron", model: "Insert", price: 495 },
  { label: "Cast Iron Combination", brand: "Cast Iron", model: "Combination", price: 695 },
  { label: "Stone Surround – Limestone", brand: "Stone", model: "Limestone", price: 599 },
  { label: "Stone Surround – Marble", brand: "Stone", model: "Marble", price: 799 },
  { label: "Wooden Surround – Oak", brand: "Wooden", model: "Oak", price: 449 },
  { label: "Wooden Surround – Painted", brand: "Wooden", model: "Painted", price: 399 },
];
