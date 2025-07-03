import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Building, MapPin, Target, MessageSquare, Users, Phone } from "lucide-react";

interface Step7ReviewSubmitProps {
  data: any;
  onSubmit: () => void;
  onPrevious: () => void;
  loading: boolean;
}

export const Step7ReviewSubmit = ({ data, onSubmit, onPrevious, loading }: Step7ReviewSubmitProps) => {
  const formatArray = (arr: string[] | undefined) => {
    if (!arr || arr.length === 0) return "None specified";
    return arr.join(", ");
  };

  const formatBusinessHours = (hours: any) => {
    if (!hours) return "Not specified";
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    return days.map(day => {
      const dayHours = hours[day];
      if (!dayHours || dayHours.closed) return `${day}: Closed`;
      return `${day}: ${dayHours.open || '09:00'} - ${dayHours.close || '17:00'}`;
    }).join('\n');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-success" />
          Step 7: Review & Submit
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm">
            Please review all the information below. Once submitted, we'll begin setting up your Google Business Profile access and optimization.
          </p>
        </div>

        {/* Business Basics */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Building className="h-4 w-4" />
            <h3 className="font-semibold">Business Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Business Name:</span> {data.business_name}
            </div>
            <div>
              <span className="font-medium">Owner/Manager:</span> {data.owner_name}
            </div>
            <div>
              <span className="font-medium">Email:</span> {data.owner_email}
            </div>
            <div>
              <span className="font-medium">Phone:</span> {data.phone || "Not provided"}
            </div>
            <div>
              <span className="font-medium">Website:</span> {data.website_url || "Not provided"}
            </div>
            <div>
              <span className="font-medium">Industry:</span> {data.industry}
            </div>
            <div className="md:col-span-2">
              <span className="font-medium">Services:</span> {formatArray(data.services_offered)}
            </div>
          </div>
        </div>

        <Separator />

        {/* Location & Contact */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-4 w-4" />
            <h3 className="font-semibold">Location & Contact</h3>
          </div>
          <div className="text-sm space-y-2">
            <div>
              <span className="font-medium">Address:</span> {data.address}
            </div>
            <div>
              <span className="font-medium">Postcode:</span> {data.postcode}
            </div>
            {data.business_hours && (
              <div>
                <span className="font-medium">Business Hours:</span>
                <pre className="text-xs mt-1 whitespace-pre-wrap">{formatBusinessHours(data.business_hours)}</pre>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Goals & Marketing */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-4 w-4" />
            <h3 className="font-semibold">Goals & Marketing</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium">Primary Goals:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {data.primary_goals?.map((goal: string, index: number) => (
                  <Badge key={index} variant="secondary">{goal}</Badge>
                ))}
              </div>
            </div>
            <div>
              <span className="font-medium">Pain Points:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {data.pain_points?.map((point: string, index: number) => (
                  <Badge key={index} variant="destructive">{point}</Badge>
                ))}
              </div>
            </div>
            <div>
              <span className="font-medium">Current Marketing:</span> {formatArray(data.current_marketing_methods)}
            </div>
            <div>
              <span className="font-medium">Marketing Budget:</span> {data.marketing_budget_range || "Not specified"}
            </div>
          </div>
        </div>

        <Separator />

        {/* Google Business Profile */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Building className="h-4 w-4" />
            <h3 className="font-semibold">Google Business Profile</h3>
          </div>
          <div className="text-sm space-y-2">
            <div>
              <span className="font-medium">Existing Profile:</span> {data.has_existing_gbp ? "Yes" : "No"}
            </div>
            {data.existing_gbp_url && (
              <div>
                <span className="font-medium">Profile URL:</span> {data.existing_gbp_url}
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* AI Response Settings */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="h-4 w-4" />
            <h3 className="font-semibold">AI Response Configuration</h3>
          </div>
          <div className="text-sm space-y-2">
            <div>
              <span className="font-medium">AI Responses:</span> {data.ai_responses_enabled ? "Enabled" : "Disabled"}
            </div>
            {data.ai_responses_enabled && (
              <>
                <div>
                  <span className="font-medium">Personality Style:</span> 
                  <Badge variant="outline" className="ml-2">{data.personality_style}</Badge>
                </div>
                <div>
                  <span className="font-medium">Response Delay:</span> {data.response_delay_hours || 2} hours
                </div>
                <div>
                  <span className="font-medium">Auto-approve:</span> 
                  {data.auto_approve_positive && <Badge variant="outline" className="ml-1">Positive</Badge>}
                  {data.auto_approve_neutral && <Badge variant="outline" className="ml-1">Neutral</Badge>}
                  {data.auto_approve_negative && <Badge variant="outline" className="ml-1">Negative</Badge>}
                </div>
              </>
            )}
          </div>
        </div>

        <Separator />

        {/* Team & Contact Preferences */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-4 w-4" />
            <h3 className="font-semibold">Team & Contact Preferences</h3>
          </div>
          <div className="text-sm space-y-2">
            <div>
              <span className="font-medium">Team Members:</span> {data.team_members?.length || 0}
            </div>
            <div>
              <span className="font-medium">Preferred Contact:</span> {data.preferred_contact_method || "Email"}
            </div>
            {data.annual_revenue_range && (
              <div>
                <span className="font-medium">Revenue Range:</span> {data.annual_revenue_range}
              </div>
            )}
          </div>
        </div>

        <div className="bg-primary/5 p-4 rounded-lg">
          <h4 className="font-medium mb-2">What happens next?</h4>
          <ol className="text-sm space-y-1 list-decimal list-inside">
            <li>We'll send you a Google Business Profile access request</li>
            <li>Accept the access request in your email</li>
            <li>We'll begin optimizing your profile within 24 hours</li>
            <li>You'll receive your personalized client dashboard access</li>
            <li>Review management and automation will be set up according to your preferences</li>
          </ol>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrevious} disabled={loading}>
            Previous
          </Button>
          <Button onClick={onSubmit} disabled={loading}>
            {loading ? "Submitting..." : "Complete Onboarding"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};