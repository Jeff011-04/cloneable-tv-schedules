
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import ShowCard from "@/components/ShowCard";
import RecommendedShows from "@/components/RecommendedShows";
import { Loader2 } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { useQuery } from "@tanstack/react-query";
import { getShowDetails } from "@/utils/api";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";

type WatchHistoryEntry = Tables<"watch_history", never>;

interface GroupedWatchHistory {
  [showId: string]: {
    showId: string;
    showTitle: string;
    episodes: WatchHistoryEntry[];
  };
}

const WatchHistory = () => {
  const { user } = useAuth();
  const [watchHistory, setWatchHistory] = useState<GroupedWatchHistory>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchWatchHistory = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('watch_history')
          .select('*')
          .eq('user_id', user.id)
          .order('watched_at', { ascending: false });

        if (error) {
          console.error('Error fetching watch history:', error);
          toast({
            title: "Error",
            description: "Failed to fetch watch history. Please try again.",
            variant: "destructive",
          });
          return;
        }

        // Group entries by show_id
        const grouped = (data || []).reduce<GroupedWatchHistory>((acc, entry) => {
          if (!acc[entry.show_id]) {
            acc[entry.show_id] = {
              showId: entry.show_id,
              showTitle: entry.show_title,
              episodes: [],
            };
          }
          acc[entry.show_id].episodes.push(entry);
          return acc;
        }, {});

        setWatchHistory(grouped);
      } catch (error) {
        console.error('Error in watch history:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWatchHistory();
  }, [user, toast]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const watchedShowTitles = Object.values(watchHistory).map(({ showTitle }) => showTitle);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-2 mb-8">
        <h1 className="text-4xl font-bold text-gradient">Watch History</h1>
        <Separator className="h-1 w-24 rounded bg-gradient-to-r from-purple-500 to-indigo-600" />
      </div>

      {Object.keys(watchHistory).length > 0 ? (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Object.values(watchHistory).map(({ showId, showTitle }) => (
              <WatchHistoryCard key={showId} showId={showId} title={showTitle} />
            ))}
          </div>

          <div className="mt-16 space-y-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-gradient">Recommended For You</h2>
              <Separator className="h-1 w-24 rounded bg-gradient-to-r from-pink-500 to-purple-600" />
              <p className="text-muted-foreground">Based on your watch history</p>
            </div>
            <RecommendedShows watchedShows={Object.keys(watchHistory)} />
          </div>
        </>
      ) : (
        <div className="mt-8 p-6 rounded-lg glass-card text-center">
          <p className="text-xl">You haven't watched any shows yet.</p>
          <p className="mt-2 text-muted-foreground">Start watching to build your history and get personalized recommendations.</p>
        </div>
      )}
    </div>
  );
};

const WatchHistoryCard = ({ showId, title }: { showId: string; title: string }) => {
  const { data: show, isLoading } = useQuery({
    queryKey: ['show', showId],
    queryFn: () => getShowDetails(showId),
  });

  if (isLoading) {
    return (
      <div className="aspect-[2/3] animate-pulse rounded-lg bg-gray-200">
        <div className="h-full w-full" />
      </div>
    );
  }

  return (
    <ShowCard
      id={showId}
      title={title}
      image={show?.Poster || "https://placehold.co/300x450?text=No+Image"}
      rating={show?.imdbRating || "N/A"}
      year={show?.Year || "N/A"}
    />
  );
};

export default WatchHistory;
