import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <main className="text-center max-w-md mx-auto px-4">
        <h1 className="text-6xl font-bold mb-4 text-primary">404</h1>
        <h2 className="text-2xl font-semibold mb-2 text-foreground">Page Not Found</h2>
        <p className="text-lg text-muted-foreground mb-6">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <nav>
          <a 
            href="/" 
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
            aria-label="Return to homepage"
          >
            Return to Home
          </a>
        </nav>
      </main>
    </div>
  );
};

export default NotFound;
