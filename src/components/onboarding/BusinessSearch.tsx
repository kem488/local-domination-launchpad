import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Star, Phone, Globe, Clock, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BusinessResult {
  place_id: string;
  name: string;
  address: string;
  phone?: string;
  website?: string;
  rating?: number;
  review_count?: number;
  industry: string;
  business_hours: any;
  confidence_score: number;
  has_photos: boolean;
}

interface BusinessSearchProps {
  onBusinessSelect: (business: BusinessResult) => void;
  onSkip: () => void;
  initialQuery?: string;
}

export const BusinessSearch = ({ onBusinessSelect, onSkip, initialQuery = "" }: BusinessSearchProps) => {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<BusinessResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setSearching(true);
    try {
      const { data, error } = await supabase.functions.invoke('search-business-details', {
        body: { query: query.trim() }
      });

      if (error) throw error;

      if (data.success) {
        setResults(data.results || []);
        setSearched(true);
        
        if (data.results.length === 0) {
          toast({
            title: "No businesses found",
            description: "Try a different search term or fill out the form manually",
            variant: "destructive"
          });
        }
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        title: "Search failed",
        description: error.message || "Please try again or fill out manually",
        variant: "destructive"
      });
    } finally {
      setSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Find Your Business</h3>
        <p className="text-muted-foreground">
          Search for your business to auto-fill your information, or skip to enter manually
        </p>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search for your business (e.g., 'Smith Plumbing Manchester')"
            className="pl-10"
          />
        </div>
        <Button 
          onClick={handleSearch} 
          disabled={searching || !query.trim()}
          className="shrink-0"
        >
          {searching ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {searched && results.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">
              No businesses found for "{query}". Try a different search term or enter your details manually.
            </p>
            <Button variant="outline" onClick={onSkip}>
              Enter Details Manually
            </Button>
          </CardContent>
        </Card>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Found {results.length} business{results.length !== 1 ? 'es' : ''}. Select yours:
          </p>
          
          {results.map((business) => (
            <Card key={business.place_id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{business.name}</h4>
                      {business.confidence_score >= 80 && (
                        <Badge variant="secondary" className="bg-success/10 text-success">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          High Match
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {business.address}
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      {business.rating && (
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                          {business.rating} ({business.review_count} reviews)
                        </div>
                      )}
                      
                      {business.phone && (
                        <div className="flex items-center text-muted-foreground">
                          <Phone className="h-4 w-4 mr-1" />
                          Phone
                        </div>
                      )}
                      
                      {business.website && (
                        <div className="flex items-center text-muted-foreground">
                          <Globe className="h-4 w-4 mr-1" />
                          Website
                        </div>
                      )}
                      
                      {Object.keys(business.business_hours).length > 0 && (
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="h-4 w-4 mr-1" />
                          Hours
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Button onClick={() => onBusinessSelect(business)}>
                    Select This Business
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="text-center pt-4 border-t">
        <Button variant="ghost" onClick={onSkip}>
          Skip and Enter Details Manually
        </Button>
      </div>
    </div>
  );
};