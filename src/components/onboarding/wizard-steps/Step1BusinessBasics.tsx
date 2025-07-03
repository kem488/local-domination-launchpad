import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";

interface Step1BusinessBasicsProps {
  data: any;
  onDataChange: (data: any) => void;
  onNext: () => void;
}

export const Step1BusinessBasics = ({ data, onDataChange, onNext }: Step1BusinessBasicsProps) => {
  const [services, setServices] = useState<string[]>(data.services_offered || []);
  const [newService, setNewService] = useState("");

  const addService = () => {
    if (newService.trim()) {
      const updatedServices = [...services, newService.trim()];
      setServices(updatedServices);
      onDataChange({ ...data, services_offered: updatedServices });
      setNewService("");
    }
  };

  const removeService = (index: number) => {
    const updatedServices = services.filter((_, i) => i !== index);
    setServices(updatedServices);
    onDataChange({ ...data, services_offered: updatedServices });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 1: Business Basics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="business_name">Business Name *</Label>
            <Input
              id="business_name"
              value={data.business_name || ""}
              onChange={(e) => onDataChange({ ...data, business_name: e.target.value })}
              placeholder="Enter your business name"
              required
            />
          </div>
          <div>
            <Label htmlFor="owner_name">Owner/Manager Name *</Label>
            <Input
              id="owner_name"
              value={data.owner_name || ""}
              onChange={(e) => onDataChange({ ...data, owner_name: e.target.value })}
              placeholder="Enter owner or manager name"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="owner_email">Business Email *</Label>
            <Input
              id="owner_email"
              type="email"
              value={data.owner_email || ""}
              onChange={(e) => onDataChange({ ...data, owner_email: e.target.value })}
              placeholder="business@example.com"
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={data.phone || ""}
              onChange={(e) => onDataChange({ ...data, phone: e.target.value })}
              placeholder="01234 567890"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="website_url">Website URL</Label>
          <Input
            id="website_url"
            type="url"
            value={data.website_url || ""}
            onChange={(e) => onDataChange({ ...data, website_url: e.target.value })}
            placeholder="https://www.yourbusiness.com"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="industry">Industry *</Label>
            <Select
              value={data.industry || ""}
              onValueChange={(value) => onDataChange({ ...data, industry: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="plumbing">Plumbing</SelectItem>
                <SelectItem value="electrical">Electrical</SelectItem>
                <SelectItem value="heating">Heating & HVAC</SelectItem>
                <SelectItem value="landscaping">Landscaping</SelectItem>
                <SelectItem value="roofing">Roofing</SelectItem>
                <SelectItem value="painting">Painting & Decorating</SelectItem>
                <SelectItem value="construction">Construction</SelectItem>
                <SelectItem value="automotive">Automotive</SelectItem>
                <SelectItem value="cleaning">Cleaning Services</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="team_size">Team Size</Label>
            <Select
              value={data.team_size?.toString() || ""}
              onValueChange={(value) => onDataChange({ ...data, team_size: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select team size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Just me</SelectItem>
                <SelectItem value="2">2-5 people</SelectItem>
                <SelectItem value="6">6-10 people</SelectItem>
                <SelectItem value="11">11-20 people</SelectItem>
                <SelectItem value="21">20+ people</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>Services Offered *</Label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newService}
              onChange={(e) => setNewService(e.target.value)}
              placeholder="Add a service"
              onKeyPress={(e) => e.key === 'Enter' && addService()}
            />
            <Button type="button" onClick={addService} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {services.map((service, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {service}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeService(index)}
                />
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="target_audience">Target Audience</Label>
          <Textarea
            id="target_audience"
            value={data.target_audience || ""}
            onChange={(e) => onDataChange({ ...data, target_audience: e.target.value })}
            placeholder="Describe your ideal customers (e.g., homeowners, small businesses, etc.)"
            rows={3}
          />
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={onNext}
            disabled={!data.business_name || !data.owner_name || !data.owner_email || !data.industry || services.length === 0}
          >
            Next Step
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};