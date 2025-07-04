import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, Edit, MapPin, Phone, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BusinessRecord } from "@/types/business";

interface BusinessProfileCardProps {
  business: BusinessRecord;
}

export const BusinessProfileCard = ({ business }: BusinessProfileCardProps) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Business Profile
        </CardTitle>
        <Button variant="outline" size="sm" onClick={() => navigate('/onboarding')}>
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium">{business.business_name}</h4>
          <p className="text-sm text-muted-foreground">{business.industry}</p>
        </div>
        
        {business.address && (
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="text-sm">
              <div>{business.address}</div>
              {business.postcode && <div>{business.postcode}</div>}
            </div>
          </div>
        )}
        
        {business.phone && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{business.phone}</span>
          </div>
        )}
        
        {business.website_url && (
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <a href={business.website_url} target="_blank" rel="noopener noreferrer" 
               className="text-sm text-primary hover:underline">
              {business.website_url}
            </a>
          </div>
        )}
        
        {business.services_offered && business.services_offered.length > 0 && (
          <div>
            <h5 className="text-sm font-medium mb-2">Services</h5>
            <div className="flex flex-wrap gap-1">
              {business.services_offered.map((service, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {service}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};