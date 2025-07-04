export const TrustIndicators = () => {
  const indicators = [
    { value: "500+", label: "Businesses Scanned" },
    { value: "4.9/5", label: "Average Rating" },
    { value: "30s", label: "Scan Time" },
    { value: "100%", label: "Free Forever" }
  ];

  return (
    <div className="mt-16 text-center">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
        {indicators.map((indicator, index) => (
          <div key={index}>
            <div className="text-3xl font-bold text-brand-blue mb-2">
              {indicator.value}
            </div>
            <div className="text-muted-foreground">
              {indicator.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};