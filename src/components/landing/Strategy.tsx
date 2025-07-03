import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

export const Strategy = () => {
  const phases = [
    {
      id: "audit",
      title: "Business Audit",
      subtitle: "Week 1",
      description: "Complete analysis of your current online presence and local market positioning",
      features: [
        "Google Business Profile optimization assessment",
        "Competitor analysis and gap identification", 
        "Local SEO audit and keyword research",
        "Review sentiment analysis",
        "Customer journey mapping"
      ]
    },
    {
      id: "setup",
      title: "AI System Setup", 
      subtitle: "Week 2",
      description: "Implementation of our proprietary review automation and monitoring system",
      features: [
        "Automated review request sequences",
        "Smart timing based on customer behavior",
        "Multi-channel follow-up system",
        "Reputation monitoring dashboard",
        "Response templates and automation"
      ]
    },
    {
      id: "optimization",
      title: "Profile Optimization",
      subtitle: "Week 3-4", 
      description: "Complete Google Business Profile transformation for maximum local visibility",
      features: [
        "Professional business description writing",
        "Strategic keyword integration",
        "Photo optimization and management",
        "Service area and category optimization",
        "Local citation building"
      ]
    },
    {
      id: "activation",
      title: "Review Generation",
      subtitle: "Week 5-8",
      description: "Launch of systematic review acquisition campaigns",
      features: [
        "Automated customer outreach sequences",
        "SMS and email review requests",
        "QR codes and review collection tools",
        "Incentive programs for customers",
        "Review response management"
      ]
    },
    {
      id: "scaling",
      title: "Performance Scaling",
      subtitle: "Week 9-12",
      description: "Advanced strategies to accelerate growth and maintain momentum",
      features: [
        "Advanced local SEO implementation",
        "Content marketing automation",
        "Social proof amplification",
        "Referral system integration",
        "Performance analytics and reporting"
      ]
    },
    {
      id: "domination",
      title: "Market Domination",
      subtitle: "Ongoing",
      description: "Continuous optimization to maintain competitive advantage",
      features: [
        "Ongoing monitoring and adjustments",
        "Competitive intelligence tracking",
        "Advanced reputation management",
        "Local market expansion strategies",
        "Long-term growth planning"
      ]
    }
  ];

  return (
    <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            The 6-Phase Local Market Domination System
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our proven methodology that transforms local businesses from invisible to industry-leading in just 90 days.
          </p>
        </div>

        <Tabs defaultValue="audit" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 h-auto p-1">
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
              Complete System Implementation in 90 Days
            </p>
            <p className="text-muted-foreground">
              No guesswork. No trial and error. Just a proven system that works.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};