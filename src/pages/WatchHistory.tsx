import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import ShowCard from "@/components/ShowCard";
import { Loader2 } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { useQuery } from "@tanstack/react-query";
import { getShowDetails } from "@/utils/api";
import { useToast } from "@/components/ui/use-toast";

type WatchHistoryEntry = Tables<"watch_history", never>;

interface ShowDetails {
  id: string;
  title: string;
  image: string;
  rating: string;
  year: string;
}

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Watch History</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Object.values(watchHistory).map(({ showId, showTitle }) => (
          <WatchHistoryCard key={showId} showId={showId} title={showTitle} />
        ))}
      </div>
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