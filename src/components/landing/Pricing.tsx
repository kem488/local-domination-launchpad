import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock } from "lucide-react";
import { SavingsCalculator } from "@/components/ui/savings-calculator";
import { TrialPopup } from "./TrialPopup";

export const Pricing = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date('2025-07-31T23:59:59').getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const features = [
    "Complete 6-Phase System Implementation",
    "AI-Powered Review Automation Platform", 
    "Google Business Profile Optimization",
    "Automated Customer Follow-up Sequences",
    "Reputation Monitoring Dashboard",
    "Professional Review Response Templates",
    "Local SEO Optimization Package",
    "Citation Building & Management",
    "90-Day Performance Guarantee",
    "Lifetime Access & Updates",
    "Priority Email Support",
    "Monthly Strategy Calls (First 6 Months)"
  ];

  const savings = {
    lockedRate: 97,
    regularRate: 247,
    yearlySavings: (247 - 97) * 12,
    monthlySavings: 247 - 97
  };

  return (
    <section id="pricing" className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="destructive" className="mb-4">
            <Clock className="h-4 w-4 mr-2" />
            Limited Time Offer Ends July 31st
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Start Free Trial & Lock £97/Month Rate For Life
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Try our system free for 14 days, then pay just £97/month locked forever. No risk, all reward - and you'll save £1,800/year vs our regular £247/month price.
          </p>
        </div>

        {/* Countdown Timer */}
        <div className="flex justify-center mb-12">
          <Card className="p-6 bg-gradient-to-r from-destructive/10 to-warning/10 border-destructive/20 animate-pulse-glow">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-4">Offer Expires In:</h3>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div className="bg-destructive text-destructive-foreground rounded-lg p-3 animate-bounce-subtle">
                  <div className="text-2xl font-bold">{timeLeft.days}</div>
                  <div className="text-sm">Days</div>
                </div>
                <div className="bg-destructive text-destructive-foreground rounded-lg p-3 animate-bounce-subtle" style={{ animationDelay: '0.1s' }}>
                  <div className="text-2xl font-bold">{timeLeft.hours}</div>
                  <div className="text-sm">Hours</div>
                </div>
                <div className="bg-destructive text-destructive-foreground rounded-lg p-3 animate-bounce-subtle" style={{ animationDelay: '0.2s' }}>
                  <div className="text-2xl font-bold">{timeLeft.minutes}</div>
                  <div className="text-sm">Minutes</div>
                </div>
                <div className="bg-destructive text-destructive-foreground rounded-lg p-3 animate-bounce-subtle" style={{ animationDelay: '0.3s' }}>
                  <div className="text-2xl font-bold">{timeLeft.seconds}</div>
                  <div className="text-sm">Seconds</div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pricing Card */}
          <div className="lg:col-span-2">
            <Card className="relative border-primary/50 shadow-lg">
              <CardHeader className="text-center">
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-success text-success-foreground">
                  LIMITED TIME ONLY
                </Badge>
                <CardTitle className="text-3xl mt-4">Free Trial + Locked Rate</CardTitle>
                <div className="text-center py-4">
                  <div className="text-2xl font-bold text-success mb-2">14 Days FREE</div>
                  <div className="text-5xl font-bold text-primary">£97<span className="text-lg">/month</span></div>
                  <div className="text-muted-foreground line-through text-xl">£247/month</div>
                  <div className="text-success font-semibold">Save £{savings.monthlySavings}/month (£{savings.yearlySavings.toLocaleString()}/year)</div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-8">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                      <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <TrialPopup>
                  <Button 
                    size="lg" 
                    className="w-full bg-brand-orange hover:bg-brand-orange/90 text-brand-orange-foreground text-lg py-4 btn-hover-effect"
                  >
                    Start Free Trial & Lock Rate
                  </Button>
                </TrialPopup>
                
                <div className="text-center mt-4 text-sm text-muted-foreground">
                  <p>✓ 90-Day Money-Back Guarantee</p>
                  <p>✓ Secure Payment Processing</p>
                  <p>✓ Instant Access After Payment</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Savings Calculator */}
          <div className="lg:col-span-1">
            <SavingsCalculator />
          </div>
        </div>

        {/* Why Offer This Rate */}
        <div className="mt-12 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Your Investment Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                  <span>Regular Monthly Price:</span>
                  <span className="font-semibold">£247/month</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                  <span>Annual Cost (Regular):</span>
                  <span className="font-semibold">£{(savings.regularRate * 12).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-success/10 rounded-lg border border-success/20">
                  <span className="font-semibold">Your Annual Cost:</span>
                  <span className="font-bold text-success text-xl">£{(savings.lockedRate * 12).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-brand-orange/10 rounded-lg border border-brand-orange/20">
                  <span className="font-semibold text-lg">Annual Savings:</span>
                  <span className="font-bold text-brand-orange text-2xl">£{savings.yearlySavings.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-8 p-4 bg-brand-blue-light rounded-lg">
                <h4 className="font-semibold text-brand-blue mb-2">Why Offer This Rate?</h4>
                <p className="text-sm text-muted-foreground">
                  We're building our case study database across different UK trades. After July 31st, this will only be available at £247/month. Even if we increase to £300-400+ in future, your monthly rate stays locked at £97.
                </p>
              </div>

              <Button 
                variant="outline" 
                size="lg" 
                className="w-full mt-6 btn-hover-effect"
              >
                Get My Free Business Scan First
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};