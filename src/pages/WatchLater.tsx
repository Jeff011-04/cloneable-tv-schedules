import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import ShowCard from "@/components/ShowCard";
import { Loader2, Clock } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { getShowDetails } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";

type WatchLaterEntry = Tables<"watch_later">;

const WatchLater = () => {
  const { user } = useAuth();
  const [watchLater, setWatchLater] = useState<(WatchLaterEntry & { poster?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchWatchLater = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('watch_later')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;

        const enrichedData = await Promise.all(
          (data || []).map(async (entry) => {
            const showDetails = await getShowDetails(entry.show_id);
            return {
              ...entry,
              poster: showDetails?.Poster,
            };
          })
        );

        setWatchLater(enrichedData);
      } catch (error) {
        console.error('Error fetching watch later list:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch watch later list",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWatchLater();
  }, [user, toast]);

  const handleRemove = async (id: string) => {
    try {
      const { error } = await supabase
        .from('watch_later')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setWatchLater((prev) => prev.filter((item) => item.id !== id));
      toast({
        title: "Success",
        description: "Show removed from watch later list",
      });
    } catch (error) {
      console.error('Error removing from watch later:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove show from watch later list",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Watch Later</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {watchLater.map((entry) => (
          <div key={entry.id} className="relative">
            <ShowCard
              id={entry.show_id}
              title={entry.show_title}
              image={entry.poster || "https://placehold.co/300x450?text=No+Image"}
              rating="N/A"
              year="N/A"
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute right-2 top-2"
              onClick={() => handleRemove(entry.id)}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WatchLater;