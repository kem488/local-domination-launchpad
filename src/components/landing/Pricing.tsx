import { SavingsCalculator } from "@/components/ui/savings-calculator";
import { ProgressiveDisclosure } from "../optimization/ProgressiveDisclosure";
import { InteractiveROICalculator } from "@/components/ui/interactive-roi-calculator";
import { PricingHeader, PricingCountdown, PricingCard, PricingSummary } from "./pricing";

export const Pricing = () => {
  const savings = {
    lockedRate: 97,
    regularRate: 247,
    yearlySavings: (247 - 97) * 12,
    monthlySavings: 247 - 97
  };

  return (
    <section id="pricing" className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <PricingHeader />
        <PricingCountdown />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Pricing Card */}
          <div className="lg:col-span-2">
            <PricingCard savings={savings} />
          </div>

          {/* Progressive Disclosure & Calculator */}
          <div className="lg:col-span-1 space-y-8">
            <ProgressiveDisclosure />
            <SavingsCalculator />
          </div>
        </div>

        {/* Interactive ROI Calculator */}
        <div className="max-w-6xl mx-auto">
          <InteractiveROICalculator />
        </div>

        {/* Why Offer This Rate - Simplified */}
        <div className="max-w-4xl mx-auto">
          <PricingSummary savings={savings} />
        </div>
      </div>
    </section>
  );
};