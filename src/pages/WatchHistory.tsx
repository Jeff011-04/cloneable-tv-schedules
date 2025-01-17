import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import ShowCard from "@/components/ShowCard";
import { Loader2, Check } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { getShowDetails } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";

type WatchHistoryEntry = Tables<"watch_history">;

const WatchHistory = () => {
  const { user } = useAuth();
  const [watchHistory, setWatchHistory] = useState<(WatchHistoryEntry & { poster?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchWatchHistory = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('watch_history')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;

        // Fetch show details for each entry to get the poster
        const enrichedData = await Promise.all(
          (data || []).map(async (entry) => {
            const showDetails = await getShowDetails(entry.show_id);
            return {
              ...entry,
              poster: showDetails?.Poster,
            };
          })
        );

        setWatchHistory(enrichedData);
      } catch (error) {
        console.error('Error fetching watch history:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch watch history",
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
        {watchHistory.map((entry) => (
          <div key={entry.id} className="relative">
            <ShowCard
              id={entry.show_id}
              title={entry.show_title}
              image={entry.poster || "https://placehold.co/300x450?text=No+Image"}
              rating="N/A"
              year="N/A"
            />
            <Button
              variant="secondary"
              size="sm"
              className="absolute right-2 top-2 bg-green-500 hover:bg-green-600"
              disabled
            >
              <Check className="h-4 w-4" />
              Watched
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WatchHistory;