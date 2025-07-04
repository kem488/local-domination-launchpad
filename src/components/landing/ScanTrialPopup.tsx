import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ScanTrialPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ScanContext {
  scanId: string;
  businessName: string;
  businessLocation: string;
}

export const ScanTrialPopup = ({ isOpen, onClose }: ScanTrialPopupProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessType: ""
  });
  
  const [scanContext, setScanContext] = useState<ScanContext | null>(null);

  useEffect(() => {
    // Load scan context from sessionStorage
    const stored = sessionStorage.getItem('scanContext');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setScanContext({
          scanId: parsed.scanId,
          businessName: parsed.businessName,
          businessLocation: parsed.businessLocation
        });
        
        // Pre-populate business name if available
        if (parsed.businessName && !formData.name) {
          setFormData(prev => ({
            ...prev,
            name: parsed.businessName.split(' ')[0] || '' // Extract first word as potential owner name
          }));
        }
      } catch (error) {
        console.error('Error parsing scan context:', error);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Add scan context to form data
      const submissionData = {
        ...formData,
        scanId: scanContext?.scanId,
        businessName: scanContext?.businessName,
        businessLocation: scanContext?.businessLocation
      };

      const { data, error } = await supabase.functions.invoke('create-trial-rate-lock-checkout', {
        body: submissionData,
      });

      if (error) {
        throw error;
      }
      
      if (data?.url) {
        // Clear scan context after successful checkout creation
        sessionStorage.removeItem('scanContext');
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        console.error('No checkout URL received');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg md:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="text-center mb-3">
            <Badge variant="secondary" className="bg-success/10 text-success border-success/20 mb-2">
              <Clock className="h-4 w-4 mr-2" />
              Free Trial + Lock £97 Rate Before July 31st
            </Badge>
            <DialogTitle className="text-xl font-bold text-foreground">
              Start Your 14-Day Free Trial & Lock Your Rate
            </DialogTitle>
            <p className="text-muted-foreground mt-2 text-sm">
              Try our system risk-free for 14 days, then pay just £97/month locked forever (normally £247/month)
            </p>
            
            {scanContext && (
              <div className="mt-4 p-3 bg-brand-blue-light rounded-lg border border-brand-blue/20">
                <p className="text-sm font-medium text-brand-blue">
                  🎯 Based on your scan results for {scanContext.businessName}
                </p>
                <p className="text-xs text-muted-foreground">
                  We'll prioritize improvements identified in your business health check
                </p>
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
            <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
            <span className="text-xs">14 days free + £97/month locked rate for life</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-brand-orange/10 rounded-lg border border-brand-orange/20">
            <Clock className="h-4 w-4 text-brand-orange flex-shrink-0" />
            <span className="text-xs font-medium">Rate lock expires July 31st - secure yours now!</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your full name"
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="07xxx xxx xxx"
              required
            />
          </div>

          <div>
            <Label htmlFor="businessType">Business Type *</Label>
            <Select value={formData.businessType} onValueChange={(value) => setFormData({ ...formData, businessType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select your trade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="plumber">Plumber</SelectItem>
                <SelectItem value="electrician">Electrician</SelectItem>
                <SelectItem value="heating">Heating Engineer</SelectItem>
                <SelectItem value="roofer">Roofer</SelectItem>
                <SelectItem value="builder">Builder</SelectItem>
                <SelectItem value="landscaper">Landscaper</SelectItem>
                <SelectItem value="cleaner">Cleaning Service</SelectItem>
                <SelectItem value="locksmith">Locksmith</SelectItem>
                <SelectItem value="pest">Pest Control</SelectItem>
                <SelectItem value="handyman">Handyman</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            type="submit" 
            size="lg" 
            className="w-full bg-brand-orange hover:bg-brand-orange/90 text-brand-orange-foreground"
          >
            Start Free Trial & Lock £97 Rate
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            14 days free, then £97/month locked forever. Cancel anytime during trial.
            <br />Rate lock expires July 31st (normally £247/month)
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};