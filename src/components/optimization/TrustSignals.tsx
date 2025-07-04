import { Shield, Lock, Star, Award, CheckCircle2, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export const TrustSignals = () => {
  const signals = [
    {
      icon: Shield,
      text: "SSL Encrypted",
      description: "Bank-level security"
    },
    {
      icon: Lock,
      text: "GDPR Compliant", 
      description: "Your data protected"
    },
    {
      icon: Star,
      text: "4.9/5 Rating",
      description: "200+ reviews"
    },
    {
      icon: Award,
      text: "Industry Certified",
      description: "Google Partner"
    },
    {
      icon: CheckCircle2,
      text: "90-Day Guarantee",
      description: "Risk-free trial"
    },
    {
      icon: Users,
      text: "500+ Clients",
      description: "Trusted nationwide"
    }
  ];

  return (
    <Card className="bg-muted/30 border-0">
      <CardContent className="p-6">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold mb-2">Trusted by UK Tradespeople</h3>
          <p className="text-sm text-muted-foreground">Your success and security are guaranteed</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {signals.map((signal, index) => (
            <div key={index} className="flex flex-col items-center text-center p-3 bg-background rounded-lg border">
              <signal.icon className="h-6 w-6 text-primary mb-2" />
              <div className="text-sm font-medium">{signal.text}</div>
              <div className="text-xs text-muted-foreground">{signal.description}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-2 mt-6">
          <Badge variant="outline" className="text-xs">
            <Shield className="h-3 w-3 mr-1" />
            Money Back Guarantee
          </Badge>
          <Badge variant="outline" className="text-xs">
            <Lock className="h-3 w-3 mr-1" />
            Secure Payments
          </Badge>
          <Badge variant="outline" className="text-xs">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            No Long-Term Contracts
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};