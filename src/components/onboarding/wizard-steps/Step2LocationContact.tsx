import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Step2LocationContactProps {
  data: any;
  onDataChange: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const Step2LocationContact = ({ data, onDataChange, onNext, onPrevious }: Step2LocationContactProps) => {
  const handleBusinessHoursChange = (day: string, field: 'open' | 'close' | 'closed', value: string | boolean) => {
    const hours = data.business_hours || {};
    const dayHours = hours[day] || {};
    
    onDataChange({
      ...data,
      business_hours: {
        ...hours,
        [day]: {
          ...dayHours,
          [field]: value
        }
      }
    });
  };

  const handleSocialMediaChange = (platform: string, url: string) => {
    const social = data.social_media_links || {};
    onDataChange({
      ...data,
      social_media_links: {
        ...social,
        [platform]: url
      }
    });
  };

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 2: Location & Contact Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="address">Business Address *</Label>
          <Textarea
            id="address"
            value={data.address || ""}
            onChange={(e) => onDataChange({ ...data, address: e.target.value })}
            placeholder="Enter your full business address"
            rows={3}
            required
          />
        </div>

        <div>
          <Label htmlFor="postcode">Postcode *</Label>
          <Input
            id="postcode"
            value={data.postcode || ""}
            onChange={(e) => onDataChange({ ...data, postcode: e.target.value })}
            placeholder="SW1A 1AA"
            required
          />
        </div>

        <div>
          <Label>Business Hours</Label>
          <div className="space-y-3 mt-2">
            {days.map((day) => {
              const dayHours = data.business_hours?.[day] || {};
              return (
                <div key={day} className="flex items-center gap-4">
                  <div className="w-20 capitalize">{day}</div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!dayHours.closed}
                      onChange={(e) => handleBusinessHoursChange(day, 'closed', !e.target.checked)}
                    />
                    <span className="text-sm">Open</span>
                  </div>
                  {!dayHours.closed && (
                    <>
                      <Input
                        type="time"
                        value={dayHours.open || "09:00"}
                        onChange={(e) => handleBusinessHoursChange(day, 'open', e.target.value)}
                        className="w-32"
                      />
                      <span>to</span>
                      <Input
                        type="time"
                        value={dayHours.close || "17:00"}
                        onChange={(e) => handleBusinessHoursChange(day, 'close', e.target.value)}
                        className="w-32"
                      />
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <Label>Social Media Links (Optional)</Label>
          <div className="space-y-3 mt-2">
            <div>
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                type="url"
                value={data.social_media_links?.facebook || ""}
                onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                placeholder="https://facebook.com/yourbusiness"
              />
            </div>
            <div>
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                type="url"
                value={data.social_media_links?.instagram || ""}
                onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                placeholder="https://instagram.com/yourbusiness"
              />
            </div>
            <div>
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                type="url"
                value={data.social_media_links?.linkedin || ""}
                onChange={(e) => handleSocialMediaChange('linkedin', e.target.value)}
                placeholder="https://linkedin.com/company/yourbusiness"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrevious}>
            Previous
          </Button>
          <Button 
            onClick={onNext}
            disabled={!data.address || !data.postcode}
          >
            Next Step
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};