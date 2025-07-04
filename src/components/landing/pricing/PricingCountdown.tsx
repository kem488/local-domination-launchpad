import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const PricingCountdown = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
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

  return (
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
  );
};