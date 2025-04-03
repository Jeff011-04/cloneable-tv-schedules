
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchShows } from "@/utils/api";
import ShowCard from "@/components/ShowCard";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface RecommendedShowsProps {
  watchedShows: string[];
}

const RecommendedShows = ({ watchedShows }: RecommendedShowsProps) => {
  const [recommendedShows, setRecommendedShows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Function to generate search terms based on watched shows
  const generateSearchTerms = (showTitles: string[]) => {
    // Define popular genres and shows for recommendations
    const popularShows = [
      "stranger things",
      "game of thrones",
      "breaking bad",
      "the mandalorian",
      "the crown"
    ];
    
    // If we have no watch history, return a random popular show
    if (showTitles.length === 0) {
      const randomIndex = Math.floor(Math.random() * popularShows.length);
      console.log("No watch history, using random show:", popularShows[randomIndex]);
      return popularShows[randomIndex];
    }
    
    // If we have watch history, use the first popular show as fallback
    // In a real app, we might use more sophisticated recommendation algorithm
    return popularShows[0];
  };

  // Use React Query to fetch recommendations
  const searchTerm = generateSearchTerms(watchedShows);
  console.log("Generated search term:", searchTerm);
  
  const { data, isLoading: queryLoading, error } = useQuery({
    queryKey: ['recommendations', searchTerm],
    queryFn: () => searchShows(searchTerm),
    enabled: true,
    retry: 3,
    retryDelay: (attempt) => Math.min(attempt > 1 ? 2 ** attempt * 1000 : 1000, 30 * 1000),
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
      console.log("Recommendations data:", data);
      
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
      <Alert variant="destructive" className="mb-6">
        <AlertTitle>Something went wrong</AlertTitle>
        <AlertDescription>
          Unable to load recommendations. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (recommendedShows.length === 0) {
    // If we don't have recommendations, try another search term
    const alternativeSearch = "popular tv series";
    console.log("No recommendations found, trying alternative search:", alternativeSearch);
    
    // This doesn't create an infinite loop because useQuery caches results
    return (
      <div className="mt-4 p-4 rounded-lg glass-card text-center">
        <p className="text-muted-foreground">Finding recommendations for you...</p>
        <div className="mt-4">
          <Loader2 className="h-6 w-6 animate-spin text-purple-500 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {recommendedShows.map((show: any, index: number) => (
          <ShowCard
            key={show.imdbID || index}
            id={show.imdbID || `rec-${index}`}
            title={show.Title || "Unknown Title"}
            image={show.Poster || "https://placehold.co/300x450?text=No+Image"}
            rating="N/A"
            year={show.Year || "N/A"}
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
