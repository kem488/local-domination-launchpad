import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, MapPin, User, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ScanFormProps {
  onScanStart: (businessName: string, businessLocation: string) => void;
}

export const ScanForm = ({ onScanStart }: ScanFormProps) => {
  const [businessName, setBusinessName] = useState("");
  const [businessLocation, setBusinessLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();

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
        <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
          Free Business Analysis
        </h3>
        <p className="text-muted-foreground text-base md:text-lg">
          Get your personalized growth report in 30 seconds
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto">
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
              className="pl-10 h-12 text-base touch-target"
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
              className="pl-10 h-12 text-base touch-target"
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full bg-brand-orange hover:bg-brand-orange/90 text-brand-orange-foreground px-8 py-4 text-lg btn-hover-effect touch-target h-14 font-semibold"
          disabled={isSubmitting || !businessName.trim() || !businessLocation.trim()}
        >
          {isSubmitting ? 'Analyzing Your Business...' : 'Get Free Analysis Now'}
        </Button>

      </form>

      <div className="mt-6 text-sm text-muted-foreground">
        ✓ Uses live Google data &nbsp; ✓ AI-powered insights &nbsp; ✓ Instant results
      </div>
    </div>
  );
};