import { useState } from "react";
import { QuoteData, initialQuoteData } from "@/types/quote";
import { StepIndicator } from "./StepIndicator";
import { StepCustomer } from "./StepCustomer";
import { StepJobType } from "./StepJobType";
import { StepProducts } from "./StepProducts";
import { StepExtras } from "./StepExtras";
import { StepLinerKit } from "./StepLinerKit";
import { StepNotes } from "./StepNotes";
import { StepSummary } from "./StepSummary";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import logo from "@/assets/logo.jpeg";
import { toast } from "sonner";

export function QuoteWizard() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<QuoteData>(initialQuoteData);

  const isWoodburner = data.jobType?.startsWith("Woodburner");
  const isTwinWall = data.jobType === "Woodburner — Twin Wall";
  const isGasCF = data.jobType === "Gas Fire — Inset (Conventional Flue)";
  // Gas Stove CF variants need a liner step; BF variants get the BF fittings step
  const isGasStoveBF = data.jobType === "Gas Stove" && (
    data.products.fire.model.includes("Balanced Flue") || data.products.fire.model.includes(" BF ")
  );
  const isGasSoveCF = data.jobType === "Gas Stove" && (
    data.products.fire.model.includes("Conventional Flue") || data.products.fire.model.includes(" CF ")
  );
  const hasFlueStep = isWoodburner || isGasCF || isGasSoveCF || isGasStoveBF;
  const totalSteps = hasFlueStep ? 7 : 6;

  // Map logical step to actual step (skip flue kit if not woodburner)
  const getActualStep = (s: number) => {
    if (!hasFlueStep && s >= 5) return s + 1;
    return s;
  };

  const actualStep = getActualStep(step);

  const validateStep = (): boolean => {
    switch (actualStep) {
      case 1: {
        const c = data.customer;
        if (!c.firstName || !c.lastName || !c.email || !c.phone || !c.address) {
          toast.error("Please fill in all customer details");
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
        return <StepCustomer data={data.customer} onChange={(customer) => setData({ ...data, customer })} />;
      case 2:
        return <StepJobType value={data.jobType} onChange={(jobType) => setData({ ...data, jobType })} />;
      case 3:
        return <StepProducts data={data.products} jobType={data.jobType} onChange={(products) => setData({ ...data, products })} />;
      case 4:
        return <StepExtras data={data.extras} jobType={data.jobType} onChange={(extras) => setData({ ...data, extras })} />;
      case 5:
        if (isTwinWall) {
          return <StepLinerKit data={data.linerKit} onChange={(linerKit) => setData({ ...data, linerKit })} mode="twinwall" twinWallData={data.twinWallKit} onTwinWallChange={(twinWallKit) => setData({ ...data, twinWallKit })} />;
        }
        if (isGasStoveBF) {
          return <StepLinerKit mode="gasstovebf" bfFittings={data.products.bfFittings} onBfFittingsChange={(bfFittings) => setData({ ...data, products: { ...data.products, bfFittings } })} />;
        }
        // covers both woodburner liner and gas CF
        return <StepLinerKit data={data.linerKit} onChange={(linerKit) => setData({ ...data, linerKit })} mode="liner" />;
      case 6:
        return <StepNotes value={data.notes} onChange={(notes) => setData({ ...data, notes })} photos={data.photos} onPhotosChange={(photos) => setData({ ...data, photos })} />;
      case 7:
        return <StepSummary data={data} onToggleVat={(includeVat) => setData({ ...data, includeVat })} />;
      default:
        return null;
    }
  };

  const stepTitles: Record<number, string> = {
    1: "Customer Details",
    2: "Job Type",
    3: "Products",
    4: "Extras",
    5: isTwinWall ? "Twin Wall Kit" : isGasStoveBF ? "BF Fittings" : "Liner Kit",
    6: "Notes",
    7: "Quote Summary",
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
        {actualStep !== 7 && (
          <Button onClick={next} className="flex-1">
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}
