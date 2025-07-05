export const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">5-Star.Digital</h3>
            <p className="text-background/80 mb-4 max-w-md">
              Helping UK local service businesses dominate their markets with AI-powered 
              review automation and Google Business Profile optimization.
            </p>
            <div className="flex space-x-4">
              <a href="mailto:admin@gudmedia.co.uk" className="text-background/80 hover:text-background">
                admin@gudmedia.co.uk
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-background/80">
              <li><a href="#how-it-works" className="hover:text-background">How It Works</a></li>
              <li><a href="#pricing" className="hover:text-background">Pricing</a></li>
              <li><a href="#faq" className="hover:text-background">FAQ</a></li>
              <li><a href="#testimonials" className="hover:text-background">Success Stories</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-background/80">
              <li><a href="/privacy" className="hover:text-background">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-background">Terms of Service</a></li>
              <li><a href="/cookies" className="hover:text-background">Cookie Policy</a></li>
              <li><a href="mailto:admin@gudmedia.co.uk" className="hover:text-background">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-background/20 mt-8 pt-8 text-center text-background/60">
          <p>&copy; 2025 GUD Media Limited. All rights reserved.</p>
          <p className="mt-2 text-sm">
            This site is not affiliated with Google LLC. Google Business Profile is a trademark of Google LLC.
          </p>
        </div>
      </div>
    </footer>
  );
};