import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Cookie, Shield, BarChart3 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const COOKIE_CONSENT_KEY = '5star-cookie-consent';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

export const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always required
    analytics: false,
    marketing: false
  });

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      setShowBanner(true);
    } else {
      const savedPreferences = JSON.parse(consent);
      setPreferences(savedPreferences);
      applyCookieSettings(savedPreferences);
    }
  }, []);

  const applyCookieSettings = (settings: CookiePreferences) => {
    // Enable/disable analytics based on consent
    if (settings.analytics && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted'
      });
    } else if (window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied'
      });
    }

    // Enable/disable marketing based on consent
    if (settings.marketing && window.fbq) {
      // Facebook Pixel already initialized, user consented
    } else {
      // Disable Facebook Pixel if not consented
      if (window.fbq) {
        window.fbq('consent', 'revoke');
      }
    }
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true
    };
    setPreferences(allAccepted);
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(allAccepted));
    applyCookieSettings(allAccepted);
    setShowBanner(false);
  };

  const handleAcceptNecessary = () => {
    const necessaryOnly = {
      necessary: true,
      analytics: false,
      marketing: false
    };
    setPreferences(necessaryOnly);
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(necessaryOnly));
    applyCookieSettings(necessaryOnly);
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(preferences));
    applyCookieSettings(preferences);
    setShowBanner(false);
    setShowPreferences(false);
  };

  const updatePreference = (key: keyof CookiePreferences, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: key === 'necessary' ? true : value // Necessary cookies always enabled
    }));
  };

  if (!showBanner) return null;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
        <Card className="max-w-4xl mx-auto bg-background border-border shadow-lg">
          <div className="p-6">
            <div className="flex items-start gap-4">
              <Cookie className="h-6 w-6 text-brand-orange flex-shrink-0 mt-1" />
              
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-2">
                  We use cookies to improve your experience
                </h3>
                
                <p className="text-sm text-muted-foreground mb-4">
                  We use essential cookies to make our site work. We'd also like to set analytics and marketing cookies to help us improve our website and understand how you use it. You can manage your preferences below.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleAcceptAll}
                    className="bg-brand-orange hover:bg-brand-orange/90 text-brand-orange-foreground"
                  >
                    Accept All Cookies
                  </Button>
                  
                  <Button
                    onClick={handleAcceptNecessary}
                    variant="outline"
                  >
                    Accept Necessary Only
                  </Button>

                  <Dialog open={showPreferences} onOpenChange={setShowPreferences}>
                    <DialogTrigger asChild>
                      <Button variant="ghost">
                        Manage Preferences
                      </Button>
                    </DialogTrigger>
                    
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Cookie Preferences</DialogTitle>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Shield className="h-4 w-4 text-green-500" />
                            <div>
                              <p className="font-medium text-sm">Necessary</p>
                              <p className="text-xs text-muted-foreground">Required for basic functionality</p>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={true}
                            disabled
                            className="h-4 w-4"
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <BarChart3 className="h-4 w-4 text-blue-500" />
                            <div>
                              <p className="font-medium text-sm">Analytics</p>
                              <p className="text-xs text-muted-foreground">Help us improve our website</p>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={preferences.analytics}
                            onChange={(e) => updatePreference('analytics', e.target.checked)}
                            className="h-4 w-4"
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Cookie className="h-4 w-4 text-orange-500" />
                            <div>
                              <p className="font-medium text-sm">Marketing</p>
                              <p className="text-xs text-muted-foreground">Personalized ads and content</p>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={preferences.marketing}
                            onChange={(e) => updatePreference('marketing', e.target.checked)}
                            className="h-4 w-4"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 mt-6">
                        <Button
                          onClick={handleSavePreferences}
                          className="flex-1 bg-brand-orange hover:bg-brand-orange/90 text-brand-orange-foreground"
                        >
                          Save Preferences
                        </Button>
                        <Button
                          onClick={() => setShowPreferences(false)}
                          variant="outline"
                        >
                          Cancel
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <p className="text-xs text-muted-foreground mt-3">
                  By continuing to use our site, you agree to our{' '}
                  <a href="/privacy" className="underline hover:text-foreground">Privacy Policy</a>
                  {' '}and{' '}
                  <a href="/cookies" className="underline hover:text-foreground">Cookie Policy</a>.
                </p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBanner(false)}
                className="flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};