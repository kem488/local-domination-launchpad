import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Mail } from "lucide-react";

interface ClientData {
  business_name: string;
  owner_name: string;
  owner_email: string;
  phone: string;
  address: string;
  postcode: string;
}

interface ClientInfoFormProps {
  clientData: ClientData;
  onClientDataChange: (data: ClientData) => void;
  onSubmit: () => void;
  loading: boolean;
}

export const ClientInfoForm = ({ clientData, onClientDataChange, onSubmit, loading }: ClientInfoFormProps) => {
  const updateField = (field: keyof ClientData, value: string) => {
    onClientDataChange({ ...clientData, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Client Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="business_name">Business Name</Label>
            <Input
              id="business_name"
              value={clientData.business_name}
              onChange={(e) => updateField('business_name', e.target.value)}
              placeholder="ABC Plumbing Ltd"
              required
            />
          </div>
          <div>
            <Label htmlFor="owner_name">Owner Name</Label>
            <Input
              id="owner_name"
              value={clientData.owner_name}
              onChange={(e) => updateField('owner_name', e.target.value)}
              placeholder="John Smith"
              required
            />
          </div>
          <div>
            <Label htmlFor="owner_email">Owner Email</Label>
            <Input
              id="owner_email"
              type="email"
              value={clientData.owner_email}
              onChange={(e) => updateField('owner_email', e.target.value)}
              placeholder="john@abcplumbing.com"
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={clientData.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              placeholder="07xxx xxx xxx"
            />
          </div>
          <div>
            <Label htmlFor="address">Business Address</Label>
            <Input
              id="address"
              value={clientData.address}
              onChange={(e) => updateField('address', e.target.value)}
              placeholder="123 High Street, London"
            />
          </div>
          <div>
            <Label htmlFor="postcode">Postcode</Label>
            <Input
              id="postcode"
              value={clientData.postcode}
              onChange={(e) => updateField('postcode', e.target.value)}
              placeholder="SW1A 1AA"
            />
          </div>
        </div>
        <Button 
          onClick={onSubmit}
          disabled={!clientData.business_name || !clientData.owner_name || !clientData.owner_email || loading}
          className="w-full"
        >
          Generate Access Request
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};