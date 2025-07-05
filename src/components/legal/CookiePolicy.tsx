export const CookiePolicy = () => {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">1. WHAT ARE COOKIES?</h2>
        <p className="mb-4">
          Cookies are small text files that are stored on your device when you visit our website. 
          They help us remember your preferences and improve your browsing experience.
        </p>
        <p>
          This Cookie Policy explains how GUD Media Limited uses cookies and similar technologies 
          on the 5-star.digital website.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">2. TYPES OF COOKIES WE USE</h2>
        
        <h3 className="text-xl font-semibold mb-3">2.1 Essential Cookies</h3>
        <p className="mb-4">
          These cookies are necessary for the website to function properly and cannot be disabled. 
          They include:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>Session cookies for maintaining your login state</li>
          <li>Security cookies for fraud prevention</li>
          <li>Cookie consent preferences</li>
          <li>Load balancing cookies</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">2.2 Analytics Cookies</h3>
        <p className="mb-4">
          These cookies help us understand how visitors interact with our website by collecting 
          anonymous information:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li><strong>Google Analytics:</strong> Tracks page views, user behavior, and site performance</li>
          <li>Visitor statistics and usage patterns</li>
          <li>Error tracking and performance monitoring</li>
          <li>A/B testing for website optimization</li>
        </ul>
        <p className="mb-4">
          <strong>Legal Basis:</strong> Legitimate interest (with option to opt-out)
        </p>

        <h3 className="text-xl font-semibold mb-3">2.3 Marketing Cookies</h3>
        <p className="mb-4">
          These cookies are used to deliver relevant advertisements and track marketing campaigns:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li><strong>Facebook Pixel:</strong> Tracks conversions and enables retargeting</li>
          <li>Advertising campaign performance</li>
          <li>Cross-platform tracking for marketing optimization</li>
          <li>Personalized content delivery</li>
        </ul>
        <p className="mb-4">
          <strong>Legal Basis:</strong> Consent (required before activation)
        </p>

        <h3 className="text-xl font-semibold mb-3">2.4 Functional Cookies</h3>
        <p className="mb-4">
          These cookies enhance website functionality and remember your preferences:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Language and region preferences</li>
          <li>Theme settings (light/dark mode)</li>
          <li>Form auto-fill information</li>
          <li>Chat widget preferences</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">3. THIRD-PARTY COOKIES</h2>
        <p className="mb-4">
          We use services from third-party providers that may set their own cookies:
        </p>
        
        <div className="space-y-4">
          <div className="border border-border rounded-lg p-4">
            <h4 className="font-semibold mb-2">Google Analytics</h4>
            <p className="text-sm text-muted-foreground mb-2">
              <strong>Purpose:</strong> Website analytics and performance monitoring
            </p>
            <p className="text-sm text-muted-foreground mb-2">
              <strong>Data Collected:</strong> Page views, session duration, user behavior
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Privacy Policy:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Privacy Policy</a>
            </p>
          </div>

          <div className="border border-border rounded-lg p-4">
            <h4 className="font-semibold mb-2">Facebook Pixel</h4>
            <p className="text-sm text-muted-foreground mb-2">
              <strong>Purpose:</strong> Advertising and conversion tracking
            </p>
            <p className="text-sm text-muted-foreground mb-2">
              <strong>Data Collected:</strong> Page visits, conversions, user interactions
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Privacy Policy:</strong> <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Facebook Privacy Policy</a>
            </p>
          </div>

          <div className="border border-border rounded-lg p-4">
            <h4 className="font-semibold mb-2">Supabase</h4>
            <p className="text-sm text-muted-foreground mb-2">
              <strong>Purpose:</strong> Backend services and data storage
            </p>
            <p className="text-sm text-muted-foreground mb-2">
              <strong>Data Collected:</strong> Authentication tokens, session management
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Privacy Policy:</strong> <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Supabase Privacy Policy</a>
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">4. MANAGING YOUR COOKIE PREFERENCES</h2>
        
        <h3 className="text-xl font-semibold mb-3">4.1 Cookie Consent Banner</h3>
        <p className="mb-4">
          When you first visit our website, you'll see a cookie consent banner where you can:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>Accept all cookies</li>
          <li>Accept only necessary cookies</li>
          <li>Manage individual cookie categories</li>
          <li>View detailed information about each cookie type</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">4.2 Browser Settings</h3>
        <p className="mb-4">
          You can also manage cookies through your browser settings:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies</li>
          <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
          <li><strong>Safari:</strong> Preferences → Privacy → Cookies and Website Data</li>
          <li><strong>Edge:</strong> Settings → Cookies and Site Permissions</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">4.3 Opt-Out Links</h3>
        <p className="mb-4">You can opt out of specific tracking services:</p>
        <ul className="list-disc list-inside space-y-1">
          <li><a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Analytics Opt-out</a></li>
          <li><a href="https://www.facebook.com/ads/preferences/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Facebook Ad Preferences</a></li>
          <li><a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Digital Advertising Alliance Opt-out</a></li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">5. COOKIE RETENTION PERIODS</h2>
        <p className="mb-4">Different cookies are stored for different periods:</p>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border p-3 text-left">Cookie Type</th>
                <th className="border border-border p-3 text-left">Retention Period</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border p-3">Session Cookies</td>
                <td className="border border-border p-3">Until browser session ends</td>
              </tr>
              <tr>
                <td className="border border-border p-3">Analytics Cookies</td>
                <td className="border border-border p-3">26 months maximum</td>
              </tr>
              <tr>
                <td className="border border-border p-3">Marketing Cookies</td>
                <td className="border border-border p-3">90 days (Facebook Pixel)</td>
              </tr>
              <tr>
                <td className="border border-border p-3">Functional Cookies</td>
                <td className="border border-border p-3">12 months</td>
              </tr>
              <tr>
                <td className="border border-border p-3">Consent Preferences</td>
                <td className="border border-border p-3">12 months</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">6. IMPACT OF DISABLING COOKIES</h2>
        <p className="mb-4">
          Disabling certain cookies may affect your experience on our website:
        </p>
        
        <h3 className="text-xl font-semibold mb-3">6.1 Essential Cookies Disabled</h3>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>Website may not function properly</li>
          <li>Security features may be compromised</li>
          <li>Unable to maintain login sessions</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">6.2 Analytics Cookies Disabled</h3>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>We cannot track website performance</li>
          <li>Difficulty identifying and fixing issues</li>
          <li>Less personalized user experience</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">6.3 Marketing Cookies Disabled</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Less relevant advertising</li>
          <li>No retargeting campaigns</li>
          <li>Cannot track marketing campaign effectiveness</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">7. UPDATES TO THIS POLICY</h2>
        <p className="mb-4">
          We may update this Cookie Policy from time to time to reflect changes in our 
          practices or for legal compliance. When we make changes, we will:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>Update the "Last Updated" date at the top of this policy</li>
          <li>Notify users through our cookie consent banner if changes are significant</li>
          <li>Provide 30 days notice for material changes</li>
        </ul>
        <p>
          Continued use of our website after changes constitute acceptance of the updated policy.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">8. CONTACT INFORMATION</h2>
        <p className="mb-4">
          If you have questions about our use of cookies or this Cookie Policy, please contact us:
        </p>
        <div className="bg-muted p-4 rounded-lg">
          <p>
            <strong>GUD Media Limited</strong><br />
            128 City Road, London EC1V 2NX<br />
            Email: admin@gudmedia.co.uk<br />
            Subject Line: "Cookie Policy Inquiry"
          </p>
        </div>
        <p className="mt-4">
          For general data protection inquiries, you can also contact the Information 
          Commissioner's Office (ICO) at <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">ico.org.uk</a>.
        </p>
      </section>
    </div>
  );
};