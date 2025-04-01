
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchShows } from "@/utils/api";
import ShowCard from "@/components/ShowCard";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface RecommendedShowsProps {
  watchedShows: string[];
}

const RecommendedShows = ({ watchedShows }: RecommendedShowsProps) => {
  const [recommendedShows, setRecommendedShows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Function to generate search terms based on watched shows
  const generateSearchTerms = (showTitles: string[]) => {
    // We need to search for similar shows, not by IMDb IDs
    // Let's use some generic terms for popular genres
    const popularGenres = ["drama", "comedy", "thriller", "fantasy", "sci-fi"];
    
    // If we have no watch history, return a random genre
    if (showTitles.length === 0) {
      const randomGenre = popularGenres[Math.floor(Math.random() * popularGenres.length)];
      return `popular ${randomGenre} series`;
    }
    
    // For simplicity, we'll use "popular shows" as a fallback
    return "popular television series";
  };

  // Use React Query to fetch recommendations
  const searchTerm = generateSearchTerms(watchedShows);
  const { data, isLoading: queryLoading, error } = useQuery({
    queryKey: ['recommendations', searchTerm],
    queryFn: () => searchShows(searchTerm),
    enabled: true, // Always enabled since we'll search for popular shows if no watch history
    meta: {
      onError: (error: Error) => {
        console.error('Error fetching recommendations:', error);
        toast({
          title: "Error loading recommendations",
          description: "We couldn't load recommendations. Please try again later.",
          variant: "destructive",
        });
      }
    }
  });

  useEffect(() => {
    if (!queryLoading && data) {
      // Filter out shows that the user has already watched
      const filteredShows = data.filter(
        (show: any) => !watchedShows.includes(show.imdbID)
      );
      
      // Take up to 5 recommendations
      setRecommendedShows(filteredShows.slice(0, 5));
      setIsLoading(false);
    } else if (!queryLoading && !data) {
      setIsLoading(false);
    }
  }, [data, queryLoading, watchedShows]);

  if (isLoading || queryLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-950/50 p-4 text-red-200 border border-red-800/50">
        Unable to load recommendations. Please try again later.
      </div>
    );
  }

  if (recommendedShows.length === 0) {
    return (
      <div className="mt-4 p-4 rounded-lg glass-card text-center">
        <p className="text-muted-foreground">No recommendations available at this time.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {recommendedShows.map((show: any, index: number) => (
          <ShowCard
            key={show.imdbID}
            id={show.imdbID}
            title={show.Title}
            image={show.Poster}
            rating="N/A"
            year={show.Year}
            className="opacity-0 animate-fade-up"
            style={{
              animationDelay: `${index * 0.1}s`,
              animationFillMode: 'forwards',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default RecommendedShows;
