import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import ShowCard from "@/components/ShowCard";
import { Loader2 } from "lucide-react";

interface WatchedShow {
  id: string;
  show_id: string;
  title: string;
  image: string;
  rating: string;
  year: string;
}

const WatchHistory = () => {
  const { user } = useAuth();
  const [watchedShows, setWatchedShows] = useState<WatchedShow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWatchHistory = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('watched_shows')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching watch history:', error);
        return;
      }

      setWatchedShows(data || []);
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
        {watchedShows.map((show) => (
          <ShowCard
            key={show.id}
            id={show.show_id}
            title={show.title}
            image={show.image}
            rating={show.rating}
            year={show.year}
          />
        ))}
      </div>
    </div>
  );
};

export default WatchHistory;