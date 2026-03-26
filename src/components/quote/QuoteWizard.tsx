import { useState } from "react";
import { QuoteData, initialQuoteData } from "@/types/quote";
import { StepIndicator } from "./StepIndicator";
import { StepCustomer } from "./StepCustomer";
import { StepJobType } from "./StepJobType";
import { StepFire } from "./StepFire";
import { StepFireplace } from "./StepFireplace";
import { StepExtras } from "./StepExtras";
import { StepLinerKit } from "./StepLinerKit";
import { StepNotes } from "./StepNotes";
import { StepSummary } from "./StepSummary";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import logo from "@/assets/logo.jpeg";
import { toast } from "sonner";
import { GATHER_HOOD_PRICES } from "@/data/fireProductsByJobType";

export function QuoteWizard() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<QuoteData>(initialQuoteData);

  // Always 8 steps
  const totalSteps = 8;
  const actualStep = step;

  const isWoodburner = data.jobType?.startsWith("Woodburner");
  const isTwinWall = data.jobType === "Woodburner — Twin Wall";
  const isGasCF = data.jobType === "Gas Fire — Inset (Conventional Flue)";
  const isGasStoveBF = data.jobType === "Gas Stove" && (
    data.products.fire.model.includes("Balanced Flue") || data.products.fire.model.includes(" BF ")
  );
  const isGasSoveCF = data.jobType === "Gas Stove" && (
    data.products.fire.model.includes("Conventional Flue") || data.products.fire.model.includes(" CF ")
  );
  const isElectric = data.jobType === "Electric Fire / Media Wall";

  const validateStep = (): boolean => {
    switch (actualStep) {
      case 1: {
        const c = data.customer;
        if (!c.jobNumber) {
          toast.error("Please enter the SM8 Job Number");
          return false;
        }
        return true;
      }
      case 2:
        if (!data.jobType) {
          toast.error("Please select a job type");
          return false;
        }
        return true;
      case 3:
        if (!data.products.fire.brand || !data.products.fire.model) {
          toast.error("Please enter fire/appliance details");
          return false;
        }
        return true;
      case 4:
        // Fireplace step is optional
        return true;
      default:
        return true;
    }
  };

  const next = () => {
    if (validateStep() && step < totalSteps) setStep(step + 1);
  };

  const prev = () => {
    if (step > 1) setStep(step - 1);
  };

  const renderStep = () => {
    switch (actualStep) {
      case 1:
        return (
          <StepCustomer
            data={data.customer}
            onChange={(customer) => setData({ ...data, customer })}
          />
        );
      case 2:
        return <StepJobType value={data.jobType} onChange={(jobType) => setData({ ...data, jobType })} />;
      case 3:
        return <StepFire data={data.products} jobType={data.jobType} onChange={(products) => setData({ ...data, products })} />;
      case 4:
        return <StepFireplace data={data.products} jobType={data.jobType} onChange={(products) => setData({ ...data, products })} />;
      case 5:
        return <StepExtras data={data.extras} jobType={data.jobType} onChange={(extras) => setData({ ...data, extras })} />;
      case 6:
        // Liner Kit — show different modes based on job type
        if (isTwinWall) {
          return <StepLinerKit data={data.linerKit} onChange={(linerKit) => setData({ ...data, linerKit })} mode="twinwall" twinWallData={data.twinWallKit} onTwinWallChange={(twinWallKit) => setData({ ...data, twinWallKit })} />;
        }
        if (isGasStoveBF) {
          return <StepLinerKit mode="gasstovebf" bfFittings={data.products.bfFittings} onBfFittingsChange={(bfFittings) => setData({ ...data, products: { ...data.products, bfFittings } })} />;
        }
        if (isGasCF) {
          return (
            <StepLinerKit
              mode="liner-gas-cf"
              data={data.linerKit}
              onChange={(linerKit) => setData({ ...data, linerKit })}
              showGasFirebox
              gasFirebox={data.products.gasFirebox}
              onGasFireboxChange={(gasFirebox) => setData({ ...data, products: { ...data.products, gasFirebox } })}
              fireModel={data.products.fire.model}
              gatherHoodEnabled={data.products.gasFireGatherHood.enabled}
              onGatherHoodChange={(enabled) => setData({
                ...data,
                products: {
                  ...data.products,
                  gasFireGatherHood: {
                    enabled,
                    priceExVat: enabled ? (GATHER_HOOD_PRICES[data.products.fire.model] ?? 0) : 0,
                  },
                },
              })}
            />
          );
        }
        if (isElectric) {
          // Electric doesn't need a liner kit, but we still show this step (could be empty or show info)
          return <div className="text-muted-foreground text-sm">No liner kit required for electric fires.</div>;
        }
        // Default: woodburner liner (also covers gas stove CF and other cases)
        return <StepLinerKit data={data.linerKit} onChange={(linerKit) => setData({ ...data, linerKit })} mode="liner" />;
      case 7:
        return (
          <StepNotes
            value={data.notes}
            onChange={(notes) => setData({ ...data, notes })}
            photos={data.photos}
            onPhotosChange={(photos) => setData({ ...data, photos })}
            labourDays={data.labourDays}
            onLabourDaysChange={(labourDays) => setData({ ...data, labourDays })}
          />
        );
      case 8:
        return <StepSummary data={data} onToggleVat={(includeVat) => setData({ ...data, includeVat })} />;
      default:
        return null;
    }
  };

  const stepTitles: Record<number, string> = {
    1: "Customer",
    2: "Job Type",
    3: "Fire",
    4: "Fireplace",
    5: "Extras",
    6: "Liner Kit",
    7: "Notes",
    8: "Summary",
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-primary text-primary-foreground px-4 py-3 shadow-md flex items-center gap-3">
        <img src={logo} alt="No1 Fires" className="h-10 w-auto rounded" />
        <div>
          <h1 className="text-lg font-bold tracking-tight">No1 Fires</h1>
          <p className="text-xs opacity-80">Field Quoting Tool</p>
        </div>
      </header>

      {/* Step indicator */}
      <StepIndicator currentStep={step} totalSteps={totalSteps} />

      {/* Step title */}
      <div className="px-4 pb-2">
        <h2 className="text-base font-bold">{stepTitles[actualStep]}</h2>
      </div>

      {/* Step content */}
      <div className="flex-1 px-4 pb-24 overflow-y-auto">
        {renderStep()}
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 flex gap-3 shadow-lg">
        <Button
          variant="outline"
          onClick={prev}
          disabled={step === 1}
          className="flex-1"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        {actualStep < totalSteps && (
          <Button onClick={next} className="flex-1">
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}
// Force rebuild Thu Mar 26 04:15:27 GMT 2026
