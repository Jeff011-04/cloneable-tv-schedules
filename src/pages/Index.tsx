import { useQuery } from "@tanstack/react-query";
import HeroSection from "@/components/HeroSection";
import TrendingShows from "@/components/TrendingShows";
import { getShowDetails } from "@/utils/api";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

const FEATURED_SHOWS = [
  {
    id: "tt0108778",
    title: "Friends",
    description: "Follows the personal and professional lives of six twenty to thirty-something-year-old friends living in Manhattan."
  },
  {
    id: "tt0944947",
    title: "Game of Thrones",
    description: "Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia."
  },
  {
    id: "tt0903747",
    title: "Breaking Bad",
    description: "A high school chemistry teacher turned methamphetamine manufacturer partners with a former student to secure his family's financial future."
  }
];

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentShowIndex, setCurrentShowIndex] = useState(0);

  const { data: currentShow, isLoading } = useQuery({
    queryKey: ["show", FEATURED_SHOWS[currentShowIndex].id],
    queryFn: () => getShowDetails(FEATURED_SHOWS[currentShowIndex].id),
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

  const currentFeaturedShow = FEATURED_SHOWS[currentShowIndex];

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
        title={currentShow?.Title || currentFeaturedShow.title}
        description={currentShow?.Plot || currentFeaturedShow.description}
        backgroundImage={currentShow?.Poster || "https://placehold.co/1920x1080"}
      />
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          {currentShow && (
            <div className="rounded-lg bg-card p-6 shadow-lg">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-xl font-semibold">Show Details</h3>
                  <div className="mt-4 space-y-2">
                    <p><span className="font-medium">Year:</span> {currentShow.Year}</p>
                    <p><span className="font-medium">Genre:</span> {currentShow.Genre}</p>
                    <p><span className="font-medium">Director:</span> {currentShow.Director}</p>
                    <p><span className="font-medium">Actors:</span> {currentShow.Actors}</p>
                    {currentShow.Type === 'series' && (
                      <p><span className="font-medium">Total Seasons:</span> {currentShow.totalSeasons}</p>
                    )}
                  </div>
                  <Button 
                    className="mt-4"
                    onClick={() => navigate(`/show/${currentShow.imdbID}`)}
                  >
                    More Info
                  </Button>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Ratings</h3>
                  <div className="mt-4 space-y-2">
                    {currentShow.Ratings?.map((rating: any, index: number) => (
                      <p key={index}>
                        <span className="font-medium">{rating.Source}:</span> {rating.Value}
                      </p>
                    ))}
                    <p><span className="font-medium">IMDB Rating:</span> {currentShow.imdbRating}</p>
                    <p><span className="font-medium">IMDB Votes:</span> {currentShow.imdbVotes}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <TrendingShows />
    </main>
  );
};

export default Index;