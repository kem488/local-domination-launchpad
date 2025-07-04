import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, CheckCircle, XCircle } from "lucide-react";

interface Step4GoogleBusinessProps {
  data: any;
  onDataChange: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const Step4GoogleBusiness = ({ data, onDataChange, onNext, onPrevious }: Step4GoogleBusinessProps) => {
  const isAutoDetected = !!(data.has_existing_gbp && data.existing_gbp_url);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Step 4: Google Business Profile
          {isAutoDetected && (
            <Badge variant="secondary" className="bg-success/10 text-success">
              <CheckCircle className="h-3 w-3 mr-1" />
              Auto-detected
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-medium">Do you currently have a Google Business Profile?</Label>
          <RadioGroup
            value={data.has_existing_gbp === true ? "yes" : data.has_existing_gbp === false ? "no" : "unsure"}
            onValueChange={(value) => {
              if (value === "yes") {
                onDataChange({ ...data, has_existing_gbp: true });
              } else if (value === "no") {
                onDataChange({ ...data, has_existing_gbp: false });
              } else {
                onDataChange({ ...data, has_existing_gbp: null });
              }
            }}
            className="mt-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="has-gbp" />
              <Label htmlFor="has-gbp" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                Yes, I have a Google Business Profile
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="no-gbp" />
              <Label htmlFor="no-gbp" className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-destructive" />
                No, I don't have one yet
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="unsure" id="unsure-gbp" />
              <Label htmlFor="unsure-gbp">I'm not sure</Label>
            </div>
          </RadioGroup>
        </div>

        {data.has_existing_gbp && data.existing_gbp_url && (
          <div>
            <Label>Google Business Profile URL</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={data.existing_gbp_url}
                readOnly
                className="bg-muted"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => window.open(data.existing_gbp_url, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {isAutoDetected ? 'Auto-detected from your business search' : 'We\'ll help you find and verify this URL'}
            </p>
          </div>
        )}

        <div>
          <Label className="text-base font-medium">What happens next?</Label>
          <div className="bg-muted p-4 rounded-lg mt-3 space-y-3">
            {data.has_existing_gbp ? (
              <>
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-1">1</Badge>
                  <div>
                    <p className="font-medium">Access Request</p>
                    <p className="text-sm text-muted-foreground">
                      We'll send you a Google Business Profile access request to manage your listing
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-1">2</Badge>
                  <div>
                    <p className="font-medium">Grant Access</p>
                    <p className="text-sm text-muted-foreground">
                      Accept the request in your email to give us management permissions
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-1">3</Badge>
                  <div>
                    <p className="font-medium">Optimization Begins</p>
                    <p className="text-sm text-muted-foreground">
                      We'll optimize your profile, set up review management, and improve your local SEO
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-1">1</Badge>
                  <div>
                    <p className="font-medium">Profile Creation</p>
                    <p className="text-sm text-muted-foreground">
                      We'll help you create and verify your Google Business Profile
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-1">2</Badge>
                  <div>
                    <p className="font-medium">Verification Process</p>
                    <p className="text-sm text-muted-foreground">
                      Google will send a verification postcard or phone call to confirm your business
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-1">3</Badge>
                  <div>
                    <p className="font-medium">Full Optimization</p>
                    <p className="text-sm text-muted-foreground">
                      Once verified, we'll fully optimize your profile for maximum visibility
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="previous_agency_experience">Previous Agency Experience (Optional)</Label>
          <Textarea
            id="previous_agency_experience"
            value={data.previous_agency_experience || ""}
            onChange={(e) => onDataChange({ ...data, previous_agency_experience: e.target.value })}
            placeholder="Tell us about any previous experience with marketing agencies (what worked, what didn't, etc.)"
            rows={3}
          />
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrevious}>
            Previous
          </Button>
          <Button onClick={onNext}>
            Next Step
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};