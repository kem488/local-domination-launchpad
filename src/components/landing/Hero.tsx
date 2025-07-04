import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, CheckCircle, TrendingUp, Calendar, Mail } from "lucide-react";
import { TrialPopup } from "./TrialPopup";
import { LeadCaptureForm } from "./LeadCaptureForm";
import { CalendarBooking } from "../calendar/CalendarBooking";
import { useScrollAnimation, useCountUp } from "@/hooks/useScrollAnimation";
import { useABTest, trackConversion } from "@/hooks/useABTesting";
import { useScrollTracking } from "@/hooks/useScrollTracking";
import { motion, useScroll, useTransform } from 'framer-motion';
import ReputationDashboard from "@/components/ui/reputation-hero";

export const Hero = () => {
  const { ref: statsRef, isVisible: statsVisible } = useScrollAnimation({ threshold: 0.3 });
  const headlineTest = useABTest('hero_headline');
  const ctaTest = useABTest('cta_button');
  
  useScrollTracking();
  
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  
  const reviewCount = useCountUp(25, 2000, statsVisible);
  const starRating = useCountUp(45, 2000, statsVisible);
  const profileViews = useCountUp(2, 1500, statsVisible);
  const directoryListings = useCountUp(50, 2500, statsVisible);

  const getHeadlineText = () => {
    switch (headlineTest.variant) {
      case 'Get Predictable Leads Every Month':
        return (
          <>
            Get Predictable Leads Every Month:<br />
            <span className="text-primary">25+ Reviews, 4.5+ Stars</span><br />
            in 90 Days - Guaranteed
          </>
        );
      case 'Beat Your Competitors at Their Own Game':
        return (
          <>
            Beat Your Competitors at Their Own Game:<br />
            <span className="text-primary">25+ Reviews, 4.5+ Stars</span><br />
            in 90 Days - Guaranteed
          </>
        );
      default:
        return (
          <>
            End the Feast-or-Famine Cycle:<br />
            <span className="text-primary">25+ Reviews, 4.5+ Stars</span><br />
            in 90 Days - Guaranteed
          </>
        );
    }
  };

  const handleCTAClick = () => {
    trackConversion('cta_click', 'hero', { 
      variant: ctaTest.variant,
      headline_variant: headlineTest.variant 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/70 to-background/90" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 bg-primary/5 rounded-full blur-xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, 30, 0],
              y: [0, -30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div
        className="relative z-10 container mx-auto px-4 pt-24 pb-20"
        style={{ y: heroY, opacity: heroOpacity }}
      >
        {/* Hero Content */}
        <div className="text-center mb-16">
          <motion.div
            className="mb-6 bg-brand-blue-light text-brand-blue border-brand-blue/10 rounded-full px-4 py-2 inline-block text-sm font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Limited Time: Lock £97/Month Rate For Life (Usually £247/month)
          </motion.div>
          
          <motion.h1
            id="hero-heading"
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {getHeadlineText()}
          </motion.h1>
          
          <motion.p
            className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Stop chasing customers for reviews and worrying about your next job. Our AI-powered automation system generates consistent 5-star reviews and doubles your Google visibility - so you never run out of leads again.
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <TrialPopup>
              <Button 
                size="lg" 
                className="bg-brand-orange hover:bg-brand-orange/90 text-brand-orange-foreground px-8 py-4 text-lg btn-hover-effect"
                onClick={handleCTAClick}
                id="hero-primary-cta"
              >
                {ctaTest.variant}
              </Button>
            </TrialPopup>
            <CalendarBooking>
              <Button 
                variant="outline" 
                size="lg"
                className="px-8 py-4 text-lg btn-hover-effect"
              >
                <Calendar className="h-5 w-5 mr-2" />
                Book Discovery Call
              </Button>
            </CalendarBooking>
          </motion.div>
          
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-muted-foreground mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <span>No contracts or setup fees</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-warning" />
              <span>4.9/5 average client rating</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>90-day money-back guarantee</span>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <a href="mailto:support@syngularity.com" className="hover:text-primary transition-colors">
                support@syngularity.com
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <a 
                href="https://share.syngularitylabs.com/widget/booking/7ZLny2CRwKGZVoekzEhe" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                Schedule a Call
              </a>
            </div>
          </motion.div>
        </div>

        {/* Dashboard Component */}
        <ReputationDashboard />

        {/* Features Section */}
        <motion.div
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {[
            {
              icon: <Star className="w-8 h-8" />,
              title: "Review Automation",
              description: "Generate 25+ genuine reviews automatically with our proven system"
            },
            {
              icon: <TrendingUp className="w-8 h-8" />,
              title: "Local SEO Domination",
              description: "Rank #1 in your area and double your Google Business Profile views"
            },
            {
              icon: <CheckCircle className="w-8 h-8" />,
              title: "Guaranteed Results",
              description: "4.5+ star rating and 50+ directory listings within 90 days"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="text-center p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-primary mb-4 flex justify-center">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};