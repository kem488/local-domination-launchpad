import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
export const WhoWeHelp = () => {
  const targetBusinesses = ["Plumbers & Electricians", "Roofers & Builders", "Landscapers & Gardeners", "Cleaning Services", "HVAC Engineers", "Locksmiths & Security", "Pest Control", "Handyman Services"];
  const painPoints = ["Inconsistent lead flow - feast one month, famine the next", "Spending 2-3 hours weekly chasing customers for reviews with no system", "Watching competitors with worse work steal your customers online", "Your Google Business Profile barely shows up in local searches", "Losing £1,000s in potential work to businesses with better online presence", "One negative review can destroy weeks of reputation building", "Customers can't find you when they search for your services", "Wasting ad spend while competitors dominate free organic listings"];
  return <section id="who-we-help" className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Built for UK Tradespeople Who Want Consistent Work
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            If you believe good work should speak for itself but are tired of the feast-or-famine cycle, this is for you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-primary">Who We Help</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {targetBusinesses.map((business, index) => <Badge key={index} variant="secondary" className="justify-center py-2">
                    {business}
                  </Badge>)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-destructive text-center">What We Help With</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {painPoints.map((point, index) => <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">{point}</span>
                  </li>)}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <Card className="inline-block p-6 bg-gradient-to-r from-success/10 to-primary/10 border-success/20">
            <p className="text-lg font-semibold text-foreground mb-2">
              Sound familiar? You're discovering what 90% of tradespeople don't know...
            </p>
            <p className="text-muted-foreground">
              Online reputation is now more important than word-of-mouth. 200+ UK businesses have already broken the feast-or-famine cycle with our enterprise-level tools.
            </p>
          </Card>
        </div>
      </div>
    </section>;
};