import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';

interface LegalLayoutProps {
  children: ReactNode;
  title: string;
  lastUpdated: string;
}

export const LegalLayout = ({ children, title, lastUpdated }: LegalLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{title}</span>
        </nav>

        {/* Document Header */}
        <header className="text-center mb-12">
          <h1 className="text-3xl font-bold text-foreground mb-4">{title}</h1>
          <div className="text-muted-foreground">
            <p className="mb-2">
              <strong>GUD Media Limited</strong><br />
              128 City Road, London EC1V 2NX<br />
              Company Number: 15683646
            </p>
            <p className="text-sm italic">
              Effective Date: 5 July 2025<br />
              Last Updated: {lastUpdated}
            </p>
          </div>
        </header>

        {/* Document Content */}
        <div className="prose prose-lg max-w-none">
          {children}
        </div>

        {/* Legal Navigation */}
        <div className="mt-16 pt-8 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <Link
              to="/privacy"
              className="p-4 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              <h3 className="font-semibold mb-2">Privacy Policy</h3>
              <p className="text-sm text-muted-foreground">How we collect and use your data</p>
            </Link>
            <Link
              to="/terms"
              className="p-4 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              <h3 className="font-semibold mb-2">Terms of Service</h3>
              <p className="text-sm text-muted-foreground">Rules and conditions for using our service</p>
            </Link>
            <Link
              to="/cookies"
              className="p-4 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              <h3 className="font-semibold mb-2">Cookie Policy</h3>
              <p className="text-sm text-muted-foreground">How we use cookies and tracking</p>
            </Link>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-12 p-6 bg-muted rounded-lg text-center">
          <h3 className="font-semibold mb-2">Questions about this document?</h3>
          <p className="text-muted-foreground mb-4">
            Contact us at{' '}
            <a href="mailto:admin@gudmedia.co.uk" className="text-primary hover:underline">
              admin@gudmedia.co.uk
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};