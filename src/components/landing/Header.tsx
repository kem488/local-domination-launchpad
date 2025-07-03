import { Button } from "@/components/ui/button";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-primary">SyngularityLabs.com</h1>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a href="#how-it-works" className="text-foreground/80 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                How It Works
              </a>
              <a href="#pricing" className="text-foreground/80 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                Pricing
              </a>
              <a href="#faq" className="text-foreground/80 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                FAQ
              </a>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm"
              className="hidden sm:inline-flex"
            >
              Get My Business Scan
            </Button>
            <Button 
              size="sm"
              className="bg-brand-orange hover:bg-brand-orange/90 text-brand-orange-foreground"
            >
              Secure My £97 Rate
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};