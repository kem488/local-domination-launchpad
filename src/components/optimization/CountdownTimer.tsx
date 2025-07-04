import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  targetDate: Date;
  className?: string;
  showDays?: boolean;
}

export const CountdownTimer = ({ targetDate, className = '', showDays = true }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Clock className="h-4 w-4 text-brand-orange" />
      <div className="flex items-center gap-1 font-mono text-sm">
        {showDays && timeLeft.days > 0 && (
          <>
            <span className="bg-brand-orange/10 px-2 py-1 rounded text-brand-orange font-bold">
              {formatNumber(timeLeft.days)}d
            </span>
          </>
        )}
        <span className="bg-brand-orange/10 px-2 py-1 rounded text-brand-orange font-bold">
          {formatNumber(timeLeft.hours)}h
        </span>
        <span className="bg-brand-orange/10 px-2 py-1 rounded text-brand-orange font-bold">
          {formatNumber(timeLeft.minutes)}m
        </span>
        <span className="bg-brand-orange/10 px-2 py-1 rounded text-brand-orange font-bold">
          {formatNumber(timeLeft.seconds)}s
        </span>
      </div>
    </div>
  );
};