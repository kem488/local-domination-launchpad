'use client';

import * as React from 'react';
import { motion, useMotionValue, useSpring, useScroll, useTransform } from 'framer-motion';
import { Star, TrendingUp, Eye, MessageCircle, BarChart3, Shield, CheckCircle, MapPin, Users, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReputationMetric {
  id: string;
  label: string;
  value: number;
  change: number;
  icon: React.ReactNode;
}

interface ReviewItem {
  id: string;
  platform: string;
  rating: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  text: string;
}

interface DashboardProps {
  className?: string;
}

const defaultMetrics: ReputationMetric[] = [
  {
    id: '1',
    label: 'Google Business Views',
    value: 2847,
    change: 23,
    icon: <Eye className="w-5 h-5" />
  },
  {
    id: '2',
    label: 'Customer Reviews',
    value: 127,
    change: 18,
    icon: <Star className="w-5 h-5" />
  },
  {
    id: '3',
    label: 'Local Rankings',
    value: 3,
    change: 2,
    icon: <MapPin className="w-5 h-5" />
  },
  {
    id: '4',
    label: 'Lead Generation',
    value: 94,
    change: 12,
    icon: <TrendingUp className="w-5 h-5" />
  }
];

const defaultReviews: ReviewItem[] = [
  {
    id: '1',
    platform: 'Google',
    rating: 5,
    sentiment: 'positive',
    text: 'Brilliant plumber, fixed our boiler same day - highly recommend!'
  },
  {
    id: '2',
    platform: 'Trustpilot',
    rating: 5,
    sentiment: 'positive',
    text: 'Top quality electrical work, very professional service'
  },
  {
    id: '3',
    platform: 'Facebook',
    rating: 5,
    sentiment: 'positive',
    text: 'Excellent roofer, cleaned up perfectly after the job'
  },
  {
    id: '4',
    platform: 'Yelp',
    rating: 4,
    sentiment: 'positive',
    text: 'Great heating engineer, fair prices and quality work'
  }
];

function ReputationDashboard({ className }: DashboardProps) {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = React.useState(false);
  
  const { scrollYProgress } = useScroll();
  
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  
  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 });
  
  const dashboardY = useTransform(scrollYProgress, [0, 0.3], [100, 0]);
  const dashboardOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = event.clientX - centerX;
    const mouseY = event.clientY - centerY;
    
    const rotateXValue = (mouseY / rect.height) * -10;
    const rotateYValue = (mouseX / rect.width) * 10;
    
    rotateX.set(rotateXValue);
    rotateY.set(rotateYValue);
    
    setMousePosition({ x: mouseX, y: mouseY });
  };
  
  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      className={cn(
        "relative w-full max-w-4xl mx-auto p-6 bg-background/95 backdrop-blur-sm border border-border rounded-2xl shadow-2xl",
        className
      )}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        y: dashboardY,
        opacity: dashboardOpacity,
        transformStyle: "preserve-3d",
        transformPerspective: 1000
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <motion.div
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Local Market Domination Dashboard</h2>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
          Live Monitoring
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {defaultMetrics.map((metric, index) => (
          <motion.div
            key={metric.id}
            className="p-4 bg-card border border-border rounded-lg hover:shadow-lg transition-all duration-300"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            whileHover={{ scale: 1.05, z: 10 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-muted-foreground">{metric.icon}</div>
              <div className={cn(
                "text-xs px-2 py-1 rounded-full",
                metric.change > 0 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
              )}>
                {metric.change > 0 ? '+' : ''}{metric.change}{metric.label.includes('Rankings') ? '' : '%'}
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {metric.label.includes('Rankings') ? `#${metric.value}` : metric.value.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">{metric.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Chart Section */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {/* Review Automation */}
        <div className="p-4 bg-card border border-border rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Review Automation</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Auto-Generated</span>
              <span className="text-sm font-medium text-foreground">89%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <motion.div
                className="bg-primary h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "89%" }}
                transition={{ delay: 0.8, duration: 1 }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Response Rate</span>
              <span className="text-sm font-medium text-foreground">94%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <motion.div
                className="bg-brand-orange h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "94%" }}
                transition={{ delay: 1, duration: 1 }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">5-Star Reviews</span>
              <span className="text-sm font-medium text-foreground">78%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <motion.div
                className="bg-success h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "78%" }}
                transition={{ delay: 1.2, duration: 1 }}
              />
            </div>
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="p-4 bg-card border border-border rounded-lg">
          <h3 className="font-semibold text-foreground mb-4">Recent Customer Reviews</h3>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {defaultReviews.map((review, index) => (
              <motion.div
                key={review.id}
                className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
              >
                <div className="flex items-center gap-1">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-warning text-warning" />
                  ))}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-foreground">{review.platform}</span>
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      review.sentiment === 'positive' ? 'bg-success' :
                      review.sentiment === 'neutral' ? 'bg-warning' : 'bg-destructive'
                    )} />
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{review.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Action Items */}
      <motion.div
        className="p-4 bg-primary/5 border border-primary/20 rounded-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
      >
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-primary" />
          Today's Action Items
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="text-sm text-muted-foreground">
            • Optimize 2 Google Business Profile posts
          </div>
          <div className="text-sm text-muted-foreground">
            • Respond to 3 new customer reviews
          </div>
          <div className="text-sm text-muted-foreground">
            • Update service coverage areas
          </div>
          <div className="text-sm text-muted-foreground">
            • Schedule local SEO content
          </div>
        </div>
      </motion.div>

      {/* Hover Effect Overlay */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 rounded-2xl pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
    </motion.div>
  );
}

export default ReputationDashboard;