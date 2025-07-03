import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, MapPin } from "lucide-react";

interface ScanFormProps {
  onScanStart: (businessName: string, businessLocation: string) => void;
}

export const ScanForm = ({ onScanStart }: ScanFormProps) => {
  const [businessName, setBusinessName] = useState("");
  const [businessLocation, setBusinessLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !businessLocation.trim()) return;
    
    setIsSubmitting(true);
    await onScanStart(businessName.trim(), businessLocation.trim());
    setIsSubmitting(false);
  };

  return (
    <div className="text-center">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-foreground mb-4">
          Enter Your Business Details
        </h3>
        <p className="text-muted-foreground">
          We'll analyze your Google Business Profile and show you exactly how to get more customers
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
        <div className="space-y-2 text-left">
          <Label htmlFor="businessName" className="text-sm font-medium">
            Business Name *
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="businessName"
              type="text"
              placeholder="e.g. Joe's Plumbing Services"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2 text-left">
          <Label htmlFor="businessLocation" className="text-sm font-medium">
            Location (City or Postcode) *
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="businessLocation"
              type="text"
              placeholder="e.g. Manchester or M1 2AB"
              value={businessLocation}
              onChange={(e) => setBusinessLocation(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full bg-brand-orange hover:bg-brand-orange/90 text-brand-orange-foreground px-8 py-4 text-lg btn-hover-effect"
          disabled={isSubmitting || !businessName.trim() || !businessLocation.trim()}
        >
          {isSubmitting ? 'Starting Scan...' : 'Get My Free Business Scan'}
        </Button>
      </form>

      <div className="mt-6 text-xs text-muted-foreground">
        This scan uses live Google data and AI analysis • 100% Free • No spam ever
      </div>
    </div>
  );
};