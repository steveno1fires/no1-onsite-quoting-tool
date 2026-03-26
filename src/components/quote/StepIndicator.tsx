import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const STEP_LABELS = [
  "Customer",
  "Job Type",
  "Fire",
  "Fireplace",
  "Extras",
  "Liner Kit",
  "Notes",
  "Summary",
];

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between px-2 py-4">
      {STEP_LABELS.slice(0, totalSteps).map((label, i) => {
        const step = i + 1;
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;
        return (
          <div key={label} className="flex flex-col items-center gap-1 flex-1">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all",
                isActive && "bg-primary text-primary-foreground shadow-md scale-110",
                isCompleted && "bg-secondary text-secondary-foreground",
                !isActive && !isCompleted && "bg-muted text-muted-foreground"
              )}
            >
              {isCompleted ? <Check className="w-4 h-4" /> : step}
            </div>
            <span
              className={cn(
                "text-[10px] text-center leading-tight",
                isActive ? "font-semibold text-foreground" : "text-muted-foreground"
              )}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
