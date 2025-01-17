import { useQuery } from "@tanstack/react-query";
import HeroSection from "@/components/HeroSection";
import TrendingShows from "@/components/TrendingShows";
import { getShowDetails } from "@/utils/api";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";

const FEATURED_SHOWS = ["tt0108778", "tt0944947", "tt0903747"]; // Friends, Game of Thrones, Breaking Bad

const Index = () => {
  const { user } = useAuth();
  const [currentShowIndex, setCurrentShowIndex] = useState(0);

  const { data: currentShow, isLoading, error } = useQuery({
    queryKey: ["show", FEATURED_SHOWS[currentShowIndex]],
    queryFn: () => getShowDetails(FEATURED_SHOWS[currentShowIndex]),
    retry: 2,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentShowIndex((prev) => (prev + 1) % FEATURED_SHOWS.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (error) {
      console.error('Error fetching show details:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load show details. Please try again later.",
      });
    }
  }, [error]);

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
      {currentShow && (
        <HeroSection
          title={currentShow.Title}
          description={currentShow.Plot}
          backgroundImage={currentShow.Poster !== 'N/A' ? currentShow.Poster : 'https://placehold.co/1920x1080'}
          showId={FEATURED_SHOWS[currentShowIndex]}
        />
      )}
      <TrendingShows />
    </main>
  );
};

export default Index;