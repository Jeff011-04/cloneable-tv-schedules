import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getShowDetails, getSeasonDetails } from "@/utils/api";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

const Show = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedSeason, setSelectedSeason] = useState<string>("1");
  const [episodes, setEpisodes] = useState<Array<{ Episode: string; Title: string }>>([]);
  const [isInWatchHistory, setIsInWatchHistory] = useState(false);

  const { data: show, isLoading } = useQuery({
    queryKey: ["show", id],
    queryFn: () => getShowDetails(id!),
  });

  const { data: seasonEpisodes, isLoading: isLoadingEpisodes } = useQuery({
    queryKey: ["episodes", id, selectedSeason],
    queryFn: () => getSeasonDetails(id!, selectedSeason),
    enabled: !!id && !!selectedSeason && show?.Type === "series",
  });

  // Check if show is in watch history
  useEffect(() => {
    const checkWatchHistory = async () => {
      if (!user || !id) return;
      
      try {
        const { data } = await supabase
          .from('watch_history')
          .select('*')
          .eq('user_id', user.id)
          .eq('show_id', decodeURIComponent(id))
          .maybeSingle();
        
        setIsInWatchHistory(!!data);
      } catch (error) {
        console.error('Error checking watch history:', error);
        toast({
          title: "Error",
          description: "Failed to check watch history status.",
          variant: "destructive",
        });
      }
    };

    checkWatchHistory();
  }, [user, id, toast]);

  useEffect(() => {
    if (seasonEpisodes) {
      setEpisodes(seasonEpisodes);
    }
  }, [seasonEpisodes]);

  const handleWatchHistory = async () => {
    if (!user || !show) return;

    try {
      if (isInWatchHistory) {
        // Remove from watch history
        const { error } = await supabase
          .from('watch_history')
          .delete()
          .eq('user_id', user.id)
          .eq('show_id', decodeURIComponent(id!));

        if (error) throw error;

        setIsInWatchHistory(false);
        toast({
          title: "Removed from watch history",
          description: `${show.Title} has been removed from your watch history.`,
        });
      } else {
        // Add to watch history
        const { error } = await supabase
          .from('watch_history')
          .insert({
            user_id: user.id,
            show_id: decodeURIComponent(id!),
            show_title: show.Title,
          });

        if (error) throw error;

        setIsInWatchHistory(true);
        toast({
          title: "Added to watch history",
          description: `${show.Title} has been added to your watch history.`,
        });
      }
    } catch (error) {
      console.error('Error managing watch history:', error);
      toast({
        title: "Error",
        description: "Failed to update watch history.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!show) {
    return <div>Show not found</div>;
  }

  const totalSeasons = parseInt(show.totalSeasons) || 0;
  const seasonsArray = Array.from({ length: totalSeasons }, (_, i) => (i + 1).toString());

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-[300px_1fr]">
        <div>
          <img
            src={show.Poster !== "N/A" ? show.Poster : "https://placehold.co/300x450?text=No+Image"}
            alt={show.Title}
            className="w-full rounded-lg shadow-lg"
          />
          {user && (
            <Button 
              onClick={handleWatchHistory} 
              className="mt-4 w-full"
              variant={isInWatchHistory ? "secondary" : "default"}
            >
              {isInWatchHistory ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Remove from Watch History
                </>
              ) : (
                "Add to Watch History"
              )}
            </Button>
          )}
        </div>
        <div>
          <h1 className="text-4xl font-bold">{show.Title}</h1>
          <div className="mt-4 space-y-4">
            <p className="text-lg text-muted-foreground">{show.Plot}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h2 className="font-semibold">Year</h2>
                <p>{show.Year}</p>
              </div>
              <div>
                <h2 className="font-semibold">Rating</h2>
                <p>{show.imdbRating}</p>
              </div>
              <div>
                <h2 className="font-semibold">Genre</h2>
                <p>{show.Genre}</p>
              </div>
              <div>
                <h2 className="font-semibold">Director</h2>
                <p>{show.Director}</p>
              </div>
              {show.Type === "series" && (
                <>
                  <div>
                    <h2 className="font-semibold">Total Seasons</h2>
                    <p>{show.totalSeasons}</p>
                  </div>
                  <div>
                    <h2 className="font-semibold">Episodes</h2>
                    <p>{show.Episodes || "Varies by season"}</p>
                  </div>
                  <div className="col-span-2 space-y-4">
                    <div className="space-y-2">
                      <h2 className="font-semibold mb-4">Seasons</h2>
                      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                        {seasonsArray.map((season) => (
                          <Button
                            key={season}
                            variant={selectedSeason === season ? "default" : "outline"}
                            onClick={() => setSelectedSeason(season)}
                            className="w-full h-12 text-lg font-medium transition-all duration-200 hover:scale-105"
                          >
                            {season}
                          </Button>
                        ))}
                      </div>
                    </div>
                    {isLoadingEpisodes ? (
                      <div className="flex justify-center">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <h2 className="font-semibold">Episodes</h2>
                        <div className="space-y-2">
                          {episodes.map((episode) => (
                            <div
                              key={episode.Episode}
                              className="rounded-lg border p-4 hover:bg-accent"
                            >
                              <h3 className="font-medium">
                                Episode {episode.Episode}: {episode.Title}
                              </h3>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Show;