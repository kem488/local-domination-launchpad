import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

export const Strategy = () => {
  const phases = [
    {
      id: "audit",
      title: "Instant Analysis",
      subtitle: "Step 1",
      description: "Our AI scans your Google Business Profile and analyzes every element against optimization best practices",
      features: [
        "Profile completeness assessment",
        "Photo quality analysis", 
        "Review opportunity identification",
        "Local SEO audit"
      ]
    },
    {
      id: "setup",
      title: "Improvement Identification", 
      subtitle: "Step 2",
      description: "The system identifies specific areas where your profile is losing customers and missing opportunities",
      features: [
        "Missing information detection",
        "Photo optimization recommendations",
        "Review response strategy gaps",
        "Local ranking factor analysis"
      ]
    },
    {
      id: "optimization",
      title: "Action Plan Delivery",
      subtitle: "Step 3", 
      description: "You receive a detailed report with step-by-step instructions to optimize your profile for maximum results",
      features: [
        "Prioritized improvement checklist",
        "Step-by-step optimization guide",
        "Photo and content recommendations",
        "Review generation strategy plan"
      ]
    },
    {
      id: "activation",
      title: "Ongoing Recommendations",
      subtitle: "Step 4",
      description: "Get additional tips and strategies to maintain and improve your local search presence",
      features: [
        "Monthly optimization updates",
        "New feature implementation guides",
        "Performance tracking recommendations",
        "Advanced local SEO strategies"
      ]
    }
  ];

  return (
    <section id="how-it-works" className="mobile-padding">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 lg:mb-6">
            How Our Profile Audit Works
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Our AI-powered system analyzes your Google Business Profile using proven optimization strategies developed by local marketing veterans.
          </p>
        </div>

        <Tabs defaultValue="audit" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto p-2 bg-gradient-card shadow-soft rounded-xl border border-border/50">
            {phases.map((phase) => (
              <TabsTrigger 
                key={phase.id}
                value={phase.id}
                className="flex flex-col items-center p-3 lg:p-4 rounded-lg transition-all duration-300 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-medium hover:bg-muted/50"
              >
                <div className="text-xs font-medium mb-1">{phase.subtitle}</div>
                <div className="text-sm font-semibold text-center">{phase.title}</div>
              </TabsTrigger>
            ))}
          </TabsList>

          {phases.map((phase) => (
            <TabsContent key={phase.id} value={phase.id} className="mt-8 lg:mt-12">
              <Card className="card-modern">
                <CardHeader className="pb-6">
                  <div className="flex items-center gap-4 mb-4 lg:mb-6">
                    <Badge variant="premium" className="text-sm font-semibold">
                      {phase.subtitle}
                    </Badge>
                    <CardTitle className="text-xl sm:text-2xl lg:text-3xl">{phase.title}</CardTitle>
                  </div>
                  <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed">{phase.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                    {phase.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-300">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground text-sm sm:text-base">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        <div className="text-center mt-12 lg:mt-16">
          <Card className="inline-block p-6 lg:p-8 bg-gradient-to-r from-primary/10 via-brand-blue-light to-primary/10 border-primary/20 shadow-medium hover:shadow-strong transition-all duration-300 max-w-3xl">
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-3">
              Complete Profile Optimization System
            </p>
            <p className="text-base sm:text-lg text-muted-foreground">
              Get actionable recommendations you can implement immediately.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};