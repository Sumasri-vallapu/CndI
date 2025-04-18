import { Check } from "lucide-react";
import clsx from "clsx";

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

export const StepIndicator = ({ currentStep, steps }: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-between w-full max-w-3xl mx-auto mb-6 px-4">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;

        return (
          <div key={label} className="flex items-center gap-2 flex-1">
            {/* Step Circle */}
            <div
              className={clsx(
                "rounded-full h-8 w-8 flex items-center justify-center text-sm font-medium",
                isCompleted ? "bg-walnut text-white" :
                isActive ? "border-2 border-walnut text-walnut" :
                "border border-gray-300 text-gray-400"
              )}
            >
              {isCompleted ? <Check className="w-4 h-4" /> : `0${stepNumber}`}
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-px bg-gray-300" />
            )}
          </div>
        );
      })}
    </div>
  );
};
