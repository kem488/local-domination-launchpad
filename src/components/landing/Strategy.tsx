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
        "Google Business Profile completeness assessment",
        "Photo quality and quantity analysis", 
        "Review generation opportunity identification",
        "Local SEO audit and keyword optimization",
        "Customer conversion point analysis"
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
        "Local ranking factor analysis",
        "Customer journey optimization points"
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
        "Review generation strategy plan",
        "Local SEO improvement roadmap"
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
        "Competitive positioning advice",
        "Performance tracking recommendations",
        "Advanced local SEO strategies"
      ]
    }
  ];

  return (
    <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            How Our Profile Audit Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our AI-powered system analyzes your Google Business Profile using proven optimization strategies developed by local marketing veterans.
          </p>
        </div>


        <Tabs defaultValue="audit" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto p-1">
            {phases.map((phase) => (
              <TabsTrigger 
                key={phase.id}
                value={phase.id}
                className="flex flex-col items-center p-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <div className="text-xs font-medium">{phase.subtitle}</div>
                <div className="text-sm font-semibold">{phase.title}</div>
              </TabsTrigger>
            ))}
          </TabsList>

          {phases.map((phase) => (
            <TabsContent key={phase.id} value={phase.id} className="mt-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <Badge variant="outline" className="text-primary border-primary">
                      {phase.subtitle}
                    </Badge>
                    <CardTitle className="text-2xl">{phase.title}</CardTitle>
                  </div>
                  <p className="text-lg text-muted-foreground">{phase.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {phase.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        <div className="text-center mt-12">
          <Card className="inline-block p-6 bg-gradient-to-r from-primary/10 to-brand-blue-light border-primary/20">
            <p className="text-lg font-semibold text-foreground mb-2">
              Complete Profile Optimization System
            </p>
            <p className="text-muted-foreground">
              Get actionable recommendations you can implement immediately.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};