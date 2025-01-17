import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getShowDetails } from "@/utils/api";
import { Loader2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Show = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedSeason, setSelectedSeason] = useState<string>("1");

  const { data: show, isLoading: showLoading } = useQuery({
    queryKey: ["show", id],
    queryFn: () => getShowDetails(id!),
  });

  const { data: seasonData, isLoading: seasonLoading } = useQuery({
    queryKey: ["season", id, selectedSeason],
    queryFn: async () => {
      try {
        const { data: { OMDB_API_KEY }, error } = await supabase
          .from('secrets')
          .select('OMDB_API_KEY')
          .single();

        if (error) {
          console.error('Error fetching API key:', error);
          throw new Error('Failed to fetch API key');
        }

        if (!OMDB_API_KEY) {
          throw new Error('OMDB API key not found in secrets');
        }

        const response = await fetch(
          `https://www.omdbapi.com/?i=${id}&Season=${selectedSeason}&apikey=${OMDB_API_KEY}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching season data:', error);
        throw error;
      }
    },
    enabled: !!show && show.Type === "series",
  });

  const handleWatch = async () => {
    if (!user || !show) return;

    try {
      const { error } = await supabase.from('watch_history').insert({
        user_id: user.id,
        show_id: id,
        show_title: show.Title,
      });

      if (error) throw error;

      toast({
        title: "Added to watch history",
        description: `${show.Title} has been added to your watch history.`,
      });
    } catch (error) {
      console.error('Error adding to watch history:', error);
      toast({
        title: "Error",
        description: "Failed to add show to watch history.",
        variant: "destructive",
      });
    }
  };

  const handleAddToWatchLater = async () => {
    if (!user || !show) return;

    try {
      const { error } = await supabase.from('watch_later').insert({
        user_id: user.id,
        show_id: id,
        show_title: show.Title,
      });

      if (error) throw error;

      toast({
        title: "Added to watch later",
        description: `${show.Title} has been added to your watch later list.`,
      });
    } catch (error) {
      console.error('Error adding to watch later:', error);
      toast({
        title: "Error",
        description: "Failed to add show to watch later list.",
        variant: "destructive",
      });
    }
  };

  if (showLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!show) {
    return <div>Show not found</div>;
  }

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
            <div className="mt-4 space-y-2">
              <Button onClick={handleWatch} className="w-full">
                Add to Watch History
              </Button>
              <Button onClick={handleAddToWatchLater} variant="outline" className="w-full">
                <Clock className="mr-2 h-4 w-4" />
                Watch Later
              </Button>
            </div>
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
            </div>

            {show.Type === "series" && (
              <div className="mt-6">
                <h2 className="text-2xl font-semibold mb-4">Seasons</h2>
                <div className="space-y-4">
                  <Select
                    value={selectedSeason}
                    onValueChange={setSelectedSeason}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Season" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: parseInt(show.totalSeasons) }, (_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          Season {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {seasonLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">
                        Episodes ({seasonData?.Episodes?.length || 0})
                      </h3>
                      <div className="space-y-2">
                        {seasonData?.Episodes?.map((episode: any) => (
                          <div
                            key={episode.imdbID}
                            className="p-4 rounded-lg border border-border"
                          >
                            <h4 className="font-semibold">
                              Episode {episode.Episode}: {episode.Title}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Released: {episode.Released}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Show;