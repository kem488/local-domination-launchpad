import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock } from "lucide-react";

interface TrialPopupProps {
  children: React.ReactNode;
}

export const TrialPopup = ({ children }: TrialPopupProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessType: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/create-trial-rate-lock-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.url) {
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
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="text-center mb-4">
            <Badge variant="secondary" className="bg-success/10 text-success border-success/20 mb-3">
              <Clock className="h-4 w-4 mr-2" />
              Free Trial + Lock £97 Rate Before July 31st
            </Badge>
            <DialogTitle className="text-2xl font-bold text-foreground">
              Start Your 14-Day Free Trial & Lock Your Rate
            </DialogTitle>
            <p className="text-muted-foreground mt-2">
              Try our system risk-free for 14 days, then pay just £97/month locked forever (normally £247/month)
            </p>
          </div>
        </DialogHeader>

        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <CheckCircle className="h-5 w-5 text-success" />
            <span className="text-sm">14 days completely free - no payment required</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <CheckCircle className="h-5 w-5 text-success" />
            <span className="text-sm">£97/month locked rate for life after trial</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <CheckCircle className="h-5 w-5 text-success" />
            <span className="text-sm">Cancel anytime during trial with no charge</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-brand-orange/10 rounded-lg border border-brand-orange/20">
            <Clock className="h-5 w-5 text-brand-orange" />
            <span className="text-sm font-medium">Rate lock expires July 31st - secure yours now!</span>
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