
import { useQuery } from "@tanstack/react-query";
import HeroSection from "@/components/HeroSection";
import TrendingShows from "@/components/TrendingShows";
import { getShowDetails } from "@/utils/api";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";

// Updated to more recent popular shows
const FEATURED_SHOWS = ["tt13443470", "tt7660850", "tt5834204"]; // The Last of Us, Succession, Ted Lasso

const Index = () => {
  const { user } = useAuth();
  const [currentShowIndex, setCurrentShowIndex] = useState(0);

  const { data: currentShow, isLoading, error } = useQuery({
    queryKey: ["show", FEATURED_SHOWS[currentShowIndex]],
    queryFn: () => getShowDetails(FEATURED_SHOWS[currentShowIndex]),
    retry: 3,
    retryDelay: (attempt) => Math.min(attempt > 1 ? 2 ** attempt * 1000 : 1000, 30 * 1000),
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentShowIndex((prev) => (prev + 1) % FEATURED_SHOWS.length);
    }, 5000); // Change show every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Show error toast if there's an issue
  useEffect(() => {
    if (error) {
      console.error("Error loading featured show:", error);
      toast({
        title: "Couldn't load featured show",
        description: "There was an issue loading the featured content. We'll try again later.",
        variant: "destructive",
      });
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      {user && (
        <div className="container mx-auto px-4 py-6 opacity-0 animate-fade-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
          <div className="glass-card rounded-xl p-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              Welcome back, <span className="text-gradient">{user.user_metadata.name || 'User'}</span>!
            </h2>
          </div>
        </div>
      )}
      <HeroSection
        title={currentShow?.Title || "Welcome to TV Lists"}
        description={currentShow?.Plot || "Discover and track your favorite TV shows"}
        backgroundImage={currentShow?.Poster || "https://placehold.co/1920x1080"}
      />
      <TrendingShows />
    </main>
  );
};

export default Index;
