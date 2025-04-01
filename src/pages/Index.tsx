
import { useQuery } from "@tanstack/react-query";
import HeroSection from "@/components/HeroSection";
import TrendingShows from "@/components/TrendingShows";
import { getShowDetails } from "@/utils/api";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

// Updated to more recent popular shows
const FEATURED_SHOWS = ["tt13443470", "tt7660850", "tt5834204"]; // The Last of Us, Succession, Ted Lasso

const Index = () => {
  const { user } = useAuth();
  const [currentShowIndex, setCurrentShowIndex] = useState(0);

  const { data: currentShow, isLoading } = useQuery({
    queryKey: ["show", FEATURED_SHOWS[currentShowIndex]],
    queryFn: () => getShowDetails(FEATURED_SHOWS[currentShowIndex]),
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentShowIndex((prev) => (prev + 1) % FEATURED_SHOWS.length);
    }, 5000); // Change show every 5 seconds

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      {user && (
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">
              Welcome back, {user.user_metadata.name || 'User'}!
            </h2>
          </div>
        </div>
      )}
      <HeroSection
        title={currentShow?.Title || "Loading..."}
        description={currentShow?.Plot || "Loading..."}
        backgroundImage={currentShow?.Poster || "https://placehold.co/1920x1080"}
      />
      <TrendingShows />
    </main>
  );
};

export default Index;
