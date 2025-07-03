import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const WhoWeHelp = () => {
  const targetBusinesses = [
    "Plumbers & Electricians",
    "Roofers & Builders", 
    "Landscapers & Gardeners",
    "Cleaning Services",
    "HVAC Engineers",
    "Locksmiths & Security",
    "Pest Control",
    "Handyman Services"
  ];

  const painPoints = [
    "Struggling to get enough Google reviews to compete locally",
    "Spending hours chasing customers for feedback with little response",
    "Losing jobs to competitors with higher ratings and more reviews", 
    "Google Business Profile not showing up in local searches",
    "No system in place to manage online reputation",
    "Negative reviews damaging your business image",
    "Customers can't find your business when searching locally",
    "Wasting money on ads while competitors dominate organic search"
  ];

  return (
    <section id="who-we-help" className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Built for UK Local Service Businesses
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            If you're a tradesperson or local service provider struggling with online visibility, we've got you covered.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-primary">Who We Help</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {targetBusinesses.map((business, index) => (
                  <Badge key={index} variant="secondary" className="justify-center py-2">
                    {business}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-destructive">Common Pain Points We Solve</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {painPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">{point}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <Card className="inline-block p-6 bg-gradient-to-r from-success/10 to-primary/10 border-success/20">
            <p className="text-lg font-semibold text-foreground mb-2">
              Sound familiar? You're not alone.
            </p>
            <p className="text-muted-foreground">
              Over 3,000 UK local businesses have transformed their online presence with our system.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};