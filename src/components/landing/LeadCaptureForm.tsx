import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Clock, Loader2, ArrowRight } from "lucide-react";
import { useFormValidation } from "@/hooks/useFormValidation";

interface LeadCaptureFormProps {
  children: React.ReactNode;
  variant?: "trial" | "business-scan" | "rate-lock";
}

export const LeadCaptureForm = ({ children, variant = "trial" }: LeadCaptureFormProps) => {
  const [step, setStep] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const {
    formData,
    errors,
    isSubmitting,
    submitStatus,
    updateField,
    submitForm,
    setSubmitStatus
  } = useFormValidation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await submitForm(async (data) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("Lead captured:", data);
      
      // Here you would integrate with your email capture API
      // For now, we'll just simulate success
    });

    if (success) {
      setTimeout(() => {
        setIsOpen(false);
        setStep(1);
        setSubmitStatus('idle');
      }, 3000);
    }
  };

  const getTitle = () => {
    switch (variant) {
      case "trial":
        return "Start Your 14-Day Free Trial";
      case "business-scan":
        return "Get Your Free Business Scan";
      case "rate-lock":
        return "Lock In Your £97/Month Rate";
      default:
        return "Get Started Today";
    }
  };

  const getDescription = () => {
    switch (variant) {
      case "trial":
        return "See exactly how we'll transform your online presence before paying anything";
      case "business-scan":
        return "Discover exactly how many leads you're losing right now";
      case "rate-lock":
        return "Secure your lifetime rate before July 31st deadline";
      default:
        return "Complete the form below to get started";
    }
  };

  const nextStep = () => {
    if (step === 1) {
      // Validate basic fields before moving to step 2
      const basicFieldsValid = formData.businessName && formData.email && formData.phone;
      if (basicFieldsValid) {
        setStep(2);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="text-center mb-4">
            <Badge variant="secondary" className="bg-success/10 text-success border-success/20 mb-3">
              <Clock className="h-4 w-4 mr-2" />
              {variant === "trial" ? "14 Day Free Trial" : "Limited Time Offer"}
            </Badge>
            <DialogTitle className="text-2xl font-bold text-foreground">
              {getTitle()}
            </DialogTitle>
            <p className="text-muted-foreground mt-2">
              {getDescription()}
            </p>
          </div>
        </DialogHeader>

        {submitStatus === 'success' ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              {variant === "trial" ? "Trial Started!" : "Form Submitted!"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {variant === "trial" 
                ? "Check your email for access details and next steps."
                : "We'll be in touch within 24 hours with your results."
              }
            </p>
            <Badge className="bg-brand-orange text-brand-orange-foreground">
              {variant === "trial" ? "Trial Active" : "Processing"}
            </Badge>
          </div>
        ) : (
          <>
            {/* Progress Indicator */}
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  1
                </div>
                <div className={`w-8 h-1 ${step >= 2 ? 'bg-primary' : 'bg-muted'}`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  2
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {step === 1 && (
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <h4 className="font-semibold text-foreground mb-4">Basic Information</h4>
                    
                    <div>
                      <Label htmlFor="businessName">Business Name *</Label>
                      <Input
                        id="businessName"
                        value={formData.businessName}
                        onChange={(e) => updateField('businessName', e.target.value)}
                        placeholder="e.g., Smith Plumbing Ltd"
                        className={errors.businessName ? 'border-destructive' : ''}
                        required
                      />
                      {errors.businessName && (
                        <p className="text-sm text-destructive mt-1">{errors.businessName}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        placeholder="your@email.com"
                        className={errors.email ? 'border-destructive' : ''}
                        required
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive mt-1">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        placeholder="07xxx xxx xxx"
                        className={errors.phone ? 'border-destructive' : ''}
                        required
                      />
                      {errors.phone && (
                        <p className="text-sm text-destructive mt-1">{errors.phone}</p>
                      )}
                    </div>

                    <Button 
                      type="button"
                      onClick={nextStep}
                      size="lg" 
                      className="w-full bg-brand-orange hover:bg-brand-orange/90 text-brand-orange-foreground btn-hover-effect"
                      disabled={!formData.businessName || !formData.email || !formData.phone}
                    >
                      Continue
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              )}

              {step === 2 && (
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <h4 className="font-semibold text-foreground mb-4">Additional Details</h4>
                    
                    <div>
                      <Label htmlFor="postcode">Postcode *</Label>
                      <Input
                        id="postcode"
                        value={formData.postcode}
                        onChange={(e) => updateField('postcode', e.target.value)}
                        placeholder="e.g., M1 1AA"
                        className={errors.postcode ? 'border-destructive' : ''}
                        required
                      />
                      {errors.postcode && (
                        <p className="text-sm text-destructive mt-1">{errors.postcode}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="businessType">Business Type</Label>
                      <Select value={formData.businessType} onValueChange={(value) => updateField('businessType', value)}>
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

                    <div className="flex gap-3">
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => setStep(1)}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="flex-1 bg-brand-orange hover:bg-brand-orange/90 text-brand-orange-foreground btn-hover-effect"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          `${variant === "trial" ? "Start Free Trial" : "Submit"}`
                        )}
                      </Button>
                    </div>

                    {submitStatus === 'error' && (
                      <p className="text-sm text-destructive text-center">
                        Something went wrong. Please try again.
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}
            </form>

            <div className="text-center text-xs text-muted-foreground mt-4">
              <p>✓ Secure SSL encryption ✓ No spam ✓ Unsubscribe anytime</p>
              {variant === "trial" && (
                <p className="mt-1">After trial: £97/month locked rate (usually £247/month)</p>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};