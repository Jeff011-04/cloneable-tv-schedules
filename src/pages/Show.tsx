import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getShowDetails } from "@/utils/api";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

const Show = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: show, isLoading } = useQuery({
    queryKey: ["show", id],
    queryFn: () => getShowDetails(id!),
  });

  const handleWatch = async () => {
    if (!user || !show) return;

    try {
      const { error } = await supabase.from('watched_shows').insert({
        user_id: user.id,
        show_id: id,
        title: show.Title,
        image: show.Poster,
        rating: show.imdbRating,
        year: show.Year,
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
            <Button onClick={handleWatch} className="mt-4 w-full">
              Add to Watch History
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Show;