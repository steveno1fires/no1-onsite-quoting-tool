export interface ExtraOption {
  label: string;
  type: "fixed" | "select" | "info";
  price?: number;
  options?: { label: string; price: number }[];
  description?: string;
  excludes?: string;
}

export const EXTRAS_CONFIG: ExtraOption[] = [
  {
    label: "Making Good",
    type: "select",
    options: [
      { label: "Patch", price: 250 },
      { label: "Full Wall", price: 400 },
    ],
  },
  {
    label: "Scaffolding",
    type: "select",
    excludes: "Cherry Picker",
    options: [
      { label: "Gable End", price: 550 },
      { label: "Up and Over", price: 750 },
      { label: "Bespoke", price: 0 },
    ],
  },
  {
    label: "Cherry Picker",
    type: "fixed",
    price: 350,
    excludes: "Scaffolding",
  },
  {
    label: "Gas Disconnection",
    type: "fixed",
    price: 150,
  },
  {
    label: "Electrics Disconnection",
    type: "fixed",
    price: 150,
  },
  {
    label: "CO Alarm",
    type: "fixed",
    price: 45,
  },
  {
    label: "Starter Bundle",
    type: "fixed",
    price: 250,
    description: "Includes: gloves, companion set, moisture meter, kindling, firelighters & log basket",
  },
  {
    label: "Log Kit / Log Store",
    type: "select",
    description: "Includes: bulk bag of kiln-dried logs & kindling pack",
    options: [
      { label: "Log Kit", price: 250 },
      { label: "Log Store", price: 350 },
    ],
  },
];
