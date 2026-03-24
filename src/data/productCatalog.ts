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

export const SURROUND_OPTIONS: CatalogItem[] = [
  { label: "Cast Iron Insert", price: 495 },
  { label: "Cast Iron Combination", price: 695 },
  { label: "Stone Surround – Limestone", price: 599 },
  { label: "Stone Surround – Marble", price: 799 },
  { label: "Wooden Surround – Oak", price: 449 },
  { label: "Wooden Surround – Painted", price: 399 },
];
