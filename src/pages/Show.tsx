import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getShowDetails, getSeasonDetails } from "@/utils/api";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

const Show = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedSeason, setSelectedSeason] = useState<string>("1");
  const [selectedEpisode, setSelectedEpisode] = useState<{ Episode: string; Title: string } | null>(null);
  const [episodes, setEpisodes] = useState<Array<{ Episode: string; Title: string }>>([]);
  const [isInWatchHistory, setIsInWatchHistory] = useState(false);
  const [watchedEpisodes, setWatchedEpisodes] = useState<Set<string>>(new Set());
  const [isAllEpisodesSelected, setIsAllEpisodesSelected] = useState(false);

  const { data: show, isLoading } = useQuery({
    queryKey: ["show", id],
    queryFn: () => getShowDetails(id!),
  });

  const { data: seasonEpisodes, isLoading: isLoadingEpisodes } = useQuery({
    queryKey: ["episodes", id, selectedSeason],
    queryFn: () => getSeasonDetails(id!, selectedSeason),
    enabled: !!id && !!selectedSeason && show?.Type === "series",
  });

  useEffect(() => {
    const fetchWatchHistory = async () => {
      if (!user || !id) return;
      
      const { data } = await supabase
        .from('watch_history')
        .select('*')
        .eq('user_id', user.id)
        .eq('show_id', id);
      
      if (data && data.length > 0) {
        setIsInWatchHistory(true);
        const watched = new Set(data.map(entry => `${entry.season_number}-${entry.episode_number}`));
        setWatchedEpisodes(watched);
      } else {
        setIsInWatchHistory(false);
        setWatchedEpisodes(new Set());
      }
    };

    fetchWatchHistory();
  }, [user, id]);

  useEffect(() => {
    if (seasonEpisodes) {
      setEpisodes(seasonEpisodes);
      setSelectedEpisode(null);
      
      // Check if all episodes in the current season are watched
      const allEpisodesWatched = seasonEpisodes.every(episode => 
        watchedEpisodes.has(`${selectedSeason}-${episode.Episode}`)
      );
      setIsAllEpisodesSelected(allEpisodesWatched);
    }
  }, [seasonEpisodes, watchedEpisodes, selectedSeason]);

  const handleEpisodeToggle = async (episode: { Episode: string; Title: string }) => {
    if (!user || !show) return;

    const episodeKey = `${selectedSeason}-${episode.Episode}`;
    const isWatched = watchedEpisodes.has(episodeKey);

    try {
      if (isWatched) {
        const { error } = await supabase
          .from('watch_history')
          .delete()
          .eq('user_id', user.id)
          .eq('show_id', id)
          .eq('season_number', selectedSeason)
          .eq('episode_number', episode.Episode);

        if (error) throw error;

        const newWatchedEpisodes = new Set(watchedEpisodes);
        newWatchedEpisodes.delete(episodeKey);
        setWatchedEpisodes(newWatchedEpisodes);

        toast({
          title: "Episode removed from watch history",
          description: `${show.Title} S${selectedSeason}E${episode.Episode} has been removed from your watch history.`,
        });
      } else {
        const watchHistoryData = {
          user_id: user.id,
          show_id: id,
          show_title: show.Title,
          season_number: selectedSeason,
          episode_number: episode.Episode,
          episode_title: episode.Title,
        };

        const { error } = await supabase
          .from('watch_history')
          .insert(watchHistoryData);

        if (error) throw error;

        const newWatchedEpisodes = new Set(watchedEpisodes);
        newWatchedEpisodes.add(episodeKey);
        setWatchedEpisodes(newWatchedEpisodes);

        toast({
          title: "Episode added to watch history",
          description: `${show.Title} S${selectedSeason}E${episode.Episode} has been added to your watch history.`,
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

  const handleSelectAllEpisodes = async (checked: boolean) => {
    if (!user || !show || !episodes.length) return;

    try {
      if (checked) {
        // Add all episodes to watch history
        const watchHistoryData = episodes.map(episode => ({
          user_id: user.id,
          show_id: id,
          show_title: show.Title,
          season_number: selectedSeason,
          episode_number: episode.Episode,
          episode_title: episode.Title,
        }));

        const { error } = await supabase
          .from('watch_history')
          .insert(watchHistoryData);

        if (error) throw error;

        const newWatchedEpisodes = new Set(watchedEpisodes);
        episodes.forEach(episode => {
          newWatchedEpisodes.add(`${selectedSeason}-${episode.Episode}`);
        });
        setWatchedEpisodes(newWatchedEpisodes);

        toast({
          title: "All episodes marked as watched",
          description: `All episodes of ${show.Title} Season ${selectedSeason} have been added to your watch history.`,
        });
      } else {
        // Remove all episodes from watch history
        const { error } = await supabase
          .from('watch_history')
          .delete()
          .eq('user_id', user.id)
          .eq('show_id', id)
          .eq('season_number', selectedSeason);

        if (error) throw error;

        const newWatchedEpisodes = new Set(watchedEpisodes);
        episodes.forEach(episode => {
          newWatchedEpisodes.delete(`${selectedSeason}-${episode.Episode}`);
        });
        setWatchedEpisodes(newWatchedEpisodes);

        toast({
          title: "All episodes unmarked",
          description: `All episodes of ${show.Title} Season ${selectedSeason} have been removed from your watch history.`,
        });
      }
      setIsAllEpisodesSelected(checked);
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
                        <div className="flex items-center justify-between">
                          <h2 className="font-semibold">Episodes</h2>
                          {user && episodes.length > 0 && (
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                checked={isAllEpisodesSelected}
                                onCheckedChange={handleSelectAllEpisodes}
                                className="h-5 w-5"
                              />
                              <span className="text-sm text-muted-foreground">
                                {isAllEpisodesSelected ? 'Unmark all as watched' : 'Mark all as watched'}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          {episodes.map((episode) => (
                            <div
                              key={episode.Episode}
                              className={`rounded-lg border p-4 hover:bg-accent cursor-pointer ${
                                selectedEpisode?.Episode === episode.Episode ? 'bg-accent' : ''
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium">
                                  Episode {episode.Episode}: {episode.Title}
                                </h3>
                                {user && (
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      checked={watchedEpisodes.has(`${selectedSeason}-${episode.Episode}`)}
                                      onCheckedChange={() => handleEpisodeToggle(episode)}
                                      className="h-5 w-5"
                                    />
                                    <span className="text-sm text-muted-foreground">
                                      {watchedEpisodes.has(`${selectedSeason}-${episode.Episode}`) ? 'Watched' : 'Mark as watched'}
                                    </span>
                                  </div>
                                )}
                              </div>
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