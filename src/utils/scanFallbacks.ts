
import { ScanData } from "@/components/business-scan/BusinessScanSection";

export const getFallbackRecommendations = (scanData: ScanData) => {
  const { scores, placeDetails } = scanData;
  
  const quickWins = [];
  const recommendations = [];
  
  if (scores.photos < 70) {
    quickWins.push("Add high-quality photos of your work and business");
    recommendations.push({
      category: "Visual Content",
      action: "Upload 10-15 high-quality photos showcasing your work, team, and business location",
      impact: "Photos can increase customer engagement by 42% and build trust with potential clients",
      timeframe: "1-2 days",
      difficulty: "easy"
    });
  }
  
  if (scores.reviews < 70) {
    quickWins.push("Ask satisfied customers to leave Google reviews");
    recommendations.push({
      category: "Review Management", 
      action: "Implement a systematic approach to request reviews from happy customers",
      impact: "More reviews improve local search rankings and customer trust",
      timeframe: "2-4 weeks",
      difficulty: "medium"
    });
  }
  
  if (scores.completeness < 80) {
    quickWins.push("Complete all missing profile information");
    recommendations.push({
      category: "Profile Optimization",
      action: "Fill in missing business hours, contact details, services, and description",
      impact: "Complete profiles get 2x more customer actions than incomplete ones",
      timeframe: "1 week", 
      difficulty: "easy"
    });
  }
  
  // Always include at least basic recommendations
  if (recommendations.length === 0) {
    quickWins.push("Optimize your Google Business Profile for better visibility");
    recommendations.push({
      category: "General Optimization",
      action: "Regularly update your business information and engage with customer reviews",
      impact: "Active profiles perform better in local search results",
      timeframe: "Ongoing",
      difficulty: "easy"
    });
  }
  
  return {
    priority: scores.overall < 50 ? "critical" : scores.overall < 70 ? "high" : "medium",
    quickWins: quickWins.slice(0, 3),
    recommendations: recommendations.slice(0, 4),
    profileGaps: `Your Google Business Profile needs attention in ${recommendations.length} key areas to improve local search visibility`,
    revenueImpact: `Implementing these improvements could increase your online leads by 25-40% within 3 months`
  };
};
