
import { useQuery } from "@tanstack/react-query";
import HeroSection from "@/components/HeroSection";
import TrendingShows from "@/components/TrendingShows";
import RecommendedShows from "@/components/RecommendedShows";
import { getShowDetails } from "@/utils/api";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";

// Updated to more recent popular shows
const FEATURED_SHOWS = ["tt13443470", "tt7660850", "tt5834204"]; // The Last of Us, Succession, Ted Lasso

const Index = () => {
  const { user } = useAuth();
  const [currentShowIndex, setCurrentShowIndex] = useState(0);
  const [watchedShowIds, setWatchedShowIds] = useState<string[]>([]);

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

  // Fetch watched shows if user is logged in
  useEffect(() => {
    const fetchWatchedShows = async () => {
      if (!user) return;
      
      try {
        const { data } = await supabase
          .from('watch_history')
          .select('show_id')
          .eq('user_id', user.id);
        
        if (data) {
          // Fix type issue by properly casting the data
          const showIds = [...new Set(data.map(item => item.show_id as string))];
          setWatchedShowIds(showIds);
        }
      } catch (error) {
        console.error("Error fetching watch history:", error);
      }
    };

    if (user) {
      fetchWatchedShows();
    }
  }, [user]);

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
      
      {/* Recommended shows section (only for logged-in users) */}
      {user && watchedShowIds.length > 0 && (
        <div className="container mx-auto px-4 py-10 opacity-0 animate-fade-up" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
          <div className="space-y-2 mb-6">
            <h2 className="text-3xl font-bold text-gradient">Recommended For You</h2>
            <Separator className="h-1 w-24 rounded bg-gradient-to-r from-pink-500 to-purple-600" />
            <p className="text-muted-foreground">Based on your watch history</p>
          </div>
          <RecommendedShows watchedShows={watchedShowIds} />
        </div>
      )}
      
      <TrendingShows />
    </main>
  );
};

export default Index;
