import { useBusiness } from "@/hooks/useBusiness";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";
import { StatusOverview } from "@/components/dashboard/StatusOverview";
import { BusinessProfileCard } from "@/components/dashboard/BusinessProfileCard";
import { GBPCard } from "@/components/dashboard/GBPCard";
import { calculateOnboardingProgress } from "@/utils/businessProgress";

export const Dashboard = () => {
  const { business, loading, refreshing, handleRefresh, handleResendRequest } = useBusiness();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!business) {
    return <WelcomeCard />;
  }

  const progress = calculateOnboardingProgress(business);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <DashboardHeader 
          businessName={business.business_name}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />

        <StatusOverview business={business} progress={progress} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BusinessProfileCard business={business} />
          <GBPCard business={business} onResendRequest={handleResendRequest} />
        </div>
      </div>
    </div>
  );
};