export const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-foreground via-foreground to-foreground/95 text-background py-12 lg:py-16 mobile-padding">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4 lg:mb-6 bg-gradient-to-r from-background via-background to-background/90 bg-clip-text text-transparent">
              5-Star.Digital
            </h3>
            <p className="text-background/80 mb-6 lg:mb-8 max-w-md text-sm lg:text-base leading-relaxed">
              Helping UK local service businesses dominate their markets with AI-powered 
              review automation and Google Business Profile optimization.
            </p>
            <div className="flex space-x-4">
              <a 
                href="mailto:admin@gudmedia.co.uk" 
                className="text-background/80 hover:text-background transition-colors duration-300 underline underline-offset-4 hover:underline-offset-8 font-medium"
              >
                admin@gudmedia.co.uk
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 lg:mb-6 text-lg">Quick Links</h4>
            <ul className="space-y-3 text-background/80 text-sm lg:text-base">
              <li><a href="#how-it-works" className="hover:text-background transition-colors duration-300 hover:underline underline-offset-4">How It Works</a></li>
              <li><a href="#pricing" className="hover:text-background transition-colors duration-300 hover:underline underline-offset-4">Pricing</a></li>
              <li><a href="#faq" className="hover:text-background transition-colors duration-300 hover:underline underline-offset-4">FAQ</a></li>
              <li><a href="#testimonials" className="hover:text-background transition-colors duration-300 hover:underline underline-offset-4">Success Stories</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 lg:mb-6 text-lg">Legal</h4>
            <ul className="space-y-3 text-background/80 text-sm lg:text-base">
              <li><a href="/privacy" className="hover:text-background transition-colors duration-300 hover:underline underline-offset-4">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-background transition-colors duration-300 hover:underline underline-offset-4">Terms of Service</a></li>
              <li><a href="/cookies" className="hover:text-background transition-colors duration-300 hover:underline underline-offset-4">Cookie Policy</a></li>
              <li><a href="mailto:admin@gudmedia.co.uk" className="hover:text-background transition-colors duration-300 hover:underline underline-offset-4">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-background/20 mt-8 lg:mt-12 pt-8 lg:pt-12 text-center text-background/60">
          <p className="text-sm lg:text-base font-medium">&copy; 2025 GUD Media Limited. All rights reserved.</p>
          <p className="mt-2 lg:mt-3 text-xs lg:text-sm">
            This site is not affiliated with Google LLC. Google Business Profile is a trademark of Google LLC.
          </p>
        </div>
      </div>
    </footer>
  );
};