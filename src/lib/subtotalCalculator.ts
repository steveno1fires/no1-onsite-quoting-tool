// Utility to calculate product subtotal (ex VAT)
// Used across StepProducts, StepLinerKit, and StepExtras

import { Products, LinerKit, Extra } from "@/types/quote";
import { REEDED_PANELS_PRICE, CHAMBER_TRIM_KIT_PRICE } from "@/data/productCatalog";
import { GATHER_HOOD_PRICES, ONYX_CF_FRAME_OPTIONS } from "@/data/fireProductsByJobType";
import { EXTRAS_CONFIG } from "@/data/extrasConfig";

export function calculateProductSubtotal(products: Products, jobType: string): number {
  let subtotal = 0;

  // Main fire/stove
  subtotal += products.fire.price || 0;

  // Gas fire trim (if applicable)
  if (products.gasFireTrim) {
    subtotal += products.gasFireTrim.priceExVat || 0;
    if (products.gasFireTrim.pairedTrimPrice) {
      subtotal += products.gasFireTrim.pairedTrimPrice;
    }
  }

  // C&J Fireplace (for large format)
  if (products.cjFireplace) {
    subtotal += products.cjFireplace.priceExVat || 0;
  }

  // Gas fire gather hood
  if (products.gasFireGatherHood?.enabled) {
    subtotal += products.gasFireGatherHood.priceExVat || 0;
  }

  // Gas fire lining (if present in products)
  // This is typically included in the frame selection

  // Hearth
  if (products.hearth.enabled) {
    subtotal += products.hearth.price || 0;
    if (products.hearth.price2) {
      subtotal += products.hearth.price2;
    }
  }

  // Beam
  if (products.beam.enabled) {
    subtotal += products.beam.price || 0;
  }

  // Surround
  if (products.surround.enabled) {
    subtotal += products.surround.price || 0;
  }

  // Chamber board
  if (products.chamberBoard.enabled) {
    subtotal += products.chamberBoard.boardPrice || 0;
    if (products.chamberBoard.reededPanels) {
      subtotal += REEDED_PANELS_PRICE;
    }
    if (products.chamberBoard.chamberTrimKit) {
      subtotal += CHAMBER_TRIM_KIT_PRICE;
    }
  }

  // BF fittings
  if (products.bfFittings) {
    for (const fitting of products.bfFittings) {
      if (fitting.enabled) {
        subtotal += fitting.price || 0;
      }
    }
  }

  return subtotal;
}

export function calculateLinerKitSubtotal(linerKit: LinerKit): number {
  let subtotal = linerKit.price || 0;

  subtotal += linerKit.regPlatePrice || 0;

  if (linerKit.accessories) {
    for (const acc of linerKit.accessories) {
      if (acc.enabled) {
        subtotal += acc.price || 0;
      }
    }
  }

  return subtotal;
}

export function calculateExtrasSubtotal(extras: Extra[]): number {
  let subtotal = 0;
  for (const extra of extras) {
    if (extra.enabled) {
      subtotal += extra.price || 0;
    }
  }
  return subtotal;
}

export function calculateTotalSubtotal(
  products: Products,
  jobType: string,
  linerKit: LinerKit,
  extras: Extra[]
): number {
  return (
    calculateProductSubtotal(products, jobType) +
    calculateLinerKitSubtotal(linerKit) +
    calculateExtrasSubtotal(extras)
  );
}
