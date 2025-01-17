import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import ShowCard from "@/components/ShowCard";
import { Loader2 } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

type WatchHistoryEntry = Tables<"watch_history">;

const WatchHistory = () => {
  const { user } = useAuth();
  const [watchHistory, setWatchHistory] = useState<WatchHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWatchHistory = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('watch_history')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching watch history:', error);
        return;
      }

      setWatchHistory(data || []);
      setLoading(false);
    };

    fetchWatchHistory();
  }, [user]);

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
          <ShowCard
            key={entry.id}
            id={entry.show_id}
            title={entry.show_title}
            image="https://placehold.co/300x450?text=No+Image"
            rating="N/A"
            year="N/A"
          />
        ))}
      </div>
    </div>
  );
};

export default WatchHistory;