export interface CapitalBeamProduct {
  name: string;
  size: string;
  finish: string;
  price: number;
}

export interface CapitalBeamCategory {
  category: string;
  products: CapitalBeamProduct[];
}

export const CAPITAL_BEAM_CATEGORIES: CapitalBeamCategory[] = [
  {
    category: "Classic Oak",
    products: [
      { name: '36" Geocast Classic Oak Beam', size: "917 x 140 x 105mm", finish: "Dark", price: 150 },
      { name: '36" Geocast Classic Oak Beam', size: "917 x 140 x 105mm", finish: "Light", price: 150 },
      { name: '42" Geocast Classic Oak Beam', size: "1070 x 140 x 105mm", finish: "Dark", price: 156 },
      { name: '42" Geocast Classic Oak Beam', size: "1070 x 140 x 105mm", finish: "Light", price: 156 },
      { name: '48" Geocast Classic Oak Beam', size: "1220 x 140 x 105mm", finish: "Dark", price: 162 },
      { name: '48" Geocast Classic Oak Beam', size: "1220 x 140 x 105mm", finish: "Light", price: 162 },
      { name: '48" Geocast Classic Oak Beam with Ambient Lights', size: "1220 x 140 x 105mm", finish: "Dark", price: 212 },
      { name: '48" Geocast Classic Oak Beam with Ambient Lights', size: "1220 x 140 x 105mm", finish: "Light", price: 212 },
      { name: '54" Geocast Classic Oak Beam', size: "1370 x 140 x 105mm", finish: "Dark", price: 168 },
      { name: '54" Geocast Classic Oak Beam', size: "1370 x 140 x 105mm", finish: "Light", price: 168 },
      { name: '54" Geocast Classic Oak Beam with Ambient Lights', size: "1370 x 140 x 105mm", finish: "Dark", price: 218 },
      { name: '54" Geocast Classic Oak Beam with Ambient Lights', size: "1370 x 140 x 105mm", finish: "Light", price: 218 },
      { name: '54" Geocast Classic Oak Beam with Ambient Lights', size: "1370 x 140 x 105mm", finish: "Antique Dark", price: 218 },
    ],
  },
  {
    category: "Heritage Oak",
    products: [
      { name: '48" Geocast Heritage Beam', size: "1220 x 230 x 100mm", finish: "Natural", price: 186 },
      { name: '54" Geocast Heritage Beam', size: "1370 x 230 x 100mm", finish: "Natural", price: 192 },
    ],
  },
  {
    category: "Rustic Oak",
    products: [
      { name: '48" Geocast Rustic Oak Beam', size: "1220 x 130 x 100mm", finish: "Dark", price: 168 },
      { name: '48" Geocast Rustic Oak Beam', size: "1220 x 130 x 100mm", finish: "Natural", price: 168 },
      { name: '54" Geocast Rustic Oak Beam', size: "1370 x 130 x 100mm", finish: "Dark", price: 174 },
      { name: '54" Geocast Rustic Oak Beam', size: "1370 x 130 x 100mm", finish: "Natural", price: 174 },
    ],
  },
  {
    category: "Contemporary",
    products: [
      { name: '48" Geocast Contemporary Stone Beam', size: "1220 x 140 x 105mm", finish: "Polished Concrete", price: 168 },
      { name: '48" Grey Oak Beam', size: "1220 x 140 x 105mm", finish: "Grey", price: 168 },
    ],
  },
  {
    category: "American Oak",
    products: [
      { name: '48" American Oak Beam', size: "1220 x 180 x 125mm", finish: "Dark", price: 180 },
    ],
  },
  {
    category: "Accessories",
    products: [
      { name: 'Geocast Deluxe Wall Bracket System (48" & 54")', size: "N/A", finish: "N/A", price: 36 },
    ],
  },
];
