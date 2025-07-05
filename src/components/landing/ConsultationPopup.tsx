import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Mail, Phone } from "lucide-react";
import { useConversionTracking } from "@/hooks/useConversionTracking";
import { supabase } from "@/integrations/supabase/client";

interface ConsultationPopupProps {
  children: React.ReactNode;
}

export const ConsultationPopup = ({ children }: ConsultationPopupProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessType: ""
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const { trackFormStart, trackFormCompletion, trackFormAbandonment } = useConversionTracking();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.phone || !formData.businessType) {
        throw new Error('Please fill in all required fields');
      }

      // Send to Make.com webhook
      const { error: webhookError } = await supabase.functions.invoke('send-to-make-webhook', {
        body: {
          eventType: 'consultation_request',
          data: {
            ...formData,
            timestamp: new Date().toISOString(),
            source: 'consultation_popup'
          }
        }
      });

      if (webhookError) {
        console.error('Webhook error:', webhookError);
        // Continue with success flow even if webhook fails
      }

      // Track successful form completion
      trackFormCompletion('lead_capture', formData);
      
      // Show success state
      setIsSuccess(true);
      
      // Reset form after delay
      setTimeout(() => {
        setIsOpen(false);
        setIsSuccess(false);
        setFormData({ name: "", email: "", phone: "", businessType: "" });
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting lead:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit information');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Track form start when dialog opens
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      trackFormStart('lead_capture');
      setIsSuccess(false);
    } else if (!isSubmitting && formData.name && !isSuccess) {
      // Track abandonment if form was started but not completed
      trackFormAbandonment('lead_capture', 'dialog_close');
    }
  };

  if (isSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="w-full max-w-sm sm:max-w-lg max-h-[95vh] overflow-y-auto m-2 rounded-lg">
          <div className="text-center space-y-6 py-8">
            <CheckCircle className="h-16 w-16 text-success mx-auto" />
            <div>
              <h3 className="text-xl font-bold text-foreground mb-2">Thank You!</h3>
              <p className="text-muted-foreground">
                We've received your information and will be in touch soon to discuss how we can help your business grow.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="w-full max-w-sm sm:max-w-lg md:max-w-xl max-h-[95vh] overflow-y-auto m-2 rounded-lg">
        <DialogHeader>
          <div className="text-center mb-3">
            <Badge variant="secondary" className="bg-brand-orange/10 text-brand-orange border-brand-orange/20 mb-2 text-xs">
              <Mail className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">Get Your Free Business Analysis</span>
              <span className="sm:hidden">Free Business Analysis</span>
            </Badge>
            <DialogTitle className="text-lg sm:text-xl font-bold text-foreground">
              <span className="hidden sm:inline">Ready to Dominate Your Local Market?</span>
              <span className="sm:hidden">Ready to Grow Your Business?</span>
            </DialogTitle>
            <p className="text-muted-foreground mt-2 text-xs sm:text-sm">
              <span className="hidden sm:inline">Get a personalized consultation and see how we can help you attract more customers</span>
              <span className="sm:hidden">Get personalized recommendations for your business</span>
            </p>
          </div>
        </DialogHeader>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-success flex-shrink-0" />
            <span className="text-xs">Free consultation with local marketing experts</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-success flex-shrink-0" />
            <span className="text-xs">Customized growth strategy for your trade</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-sm font-medium">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your full name"
              required
              className="mt-1 touch-target text-base"
              autoComplete="name"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-sm font-medium">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
              required
              className="mt-1 touch-target text-base"
              autoComplete="email"
              inputMode="email"
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-sm font-medium">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="07xxx xxx xxx"
              required
              className="mt-1 touch-target text-base"
              autoComplete="tel"
              inputMode="tel"
            />
          </div>

          <div>
            <Label htmlFor="businessType" className="text-sm font-medium">Business Type *</Label>
            <Select value={formData.businessType} onValueChange={(value) => setFormData({ ...formData, businessType: value })}>
              <SelectTrigger className="mt-1 touch-target">
                <SelectValue placeholder="Select your trade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="plumber">Plumber</SelectItem>
                <SelectItem value="electrician">Electrician</SelectItem>
                <SelectItem value="heating">Heating Engineer</SelectItem>
                <SelectItem value="builder">Builder</SelectItem>
                <SelectItem value="landscaper">Landscaper</SelectItem>
                <SelectItem value="cleaner">Cleaning Service</SelectItem>
                <SelectItem value="other">Other Trade</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {submitError && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
              {submitError}
            </div>
          )}

          <Button 
            type="submit" 
            size="lg" 
            disabled={isSubmitting}
            className="w-full bg-brand-orange hover:bg-brand-orange/90 text-brand-orange-foreground disabled:opacity-50 touch-target font-semibold"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Submitting...
              </div>
            ) : (
              <>
                <Phone className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Request Free Consultation</span>
                <span className="sm:hidden">Get Free Consultation</span>
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground leading-relaxed">
            We'll contact you within 24 hours to discuss your business goals and how we can help you grow.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};