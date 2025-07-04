import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const WelcomeCard = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">My Business Dashboard</h1>
            <p className="text-muted-foreground">Complete your business setup to get started</p>
          </div>
          <Button variant="ghost" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <Card>
          <CardContent className="p-8 text-center">
            <Building className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Welcome to Your Business Dashboard</h3>
            <p className="text-muted-foreground mb-6">
              Let's get your business set up for Google Business Profile optimization. 
              Complete the onboarding wizard to get started.
            </p>
            <Button onClick={() => navigate('/onboarding')}>
              <Settings className="h-4 w-4 mr-2" />
              Complete Business Setup
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};