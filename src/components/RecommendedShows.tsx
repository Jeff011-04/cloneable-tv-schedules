
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchShows, getShowDetails } from "@/utils/api";
import ShowCard from "@/components/ShowCard";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface RecommendedShowsProps {
  watchedShows: string[];
}

const RecommendedShows = ({ watchedShows }: RecommendedShowsProps) => {
  const [recommendedShows, setRecommendedShows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [genreBasedQuery, setGenreBasedQuery] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  // Function to generate search terms based on watched shows and their genres
  const generateSearchTerms = async (showIds: string[]) => {
    // Define popular genres and shows for recommendations
    const popularShows = [
      "stranger things",
      "game of thrones",
      "breaking bad",
      "the mandalorian",
      "the crown"
    ];
    
    // If we have no watch history, return a random popular show
    if (showIds.length === 0) {
      const randomIndex = Math.floor(Math.random() * popularShows.length);
      console.log("No watch history, using random show:", popularShows[randomIndex]);
      return popularShows[randomIndex];
    }
    
    try {
      // Try to get genre information from the first watched show
      const showDetails = await getShowDetails(showIds[0]);
      if (showDetails && showDetails.Genre) {
        // Extract the first genre from the comma-separated list
        const genres = showDetails.Genre.split(',').map((g: string) => g.trim());
        const primaryGenre = genres[0];
        console.log(`Found genre for recommendations: ${primaryGenre}`);
        
        // Return the genre as search term for more relevant recommendations
        setGenreBasedQuery(primaryGenre);
        return primaryGenre;
      }
    } catch (error) {
      console.error("Error fetching show details for recommendations:", error);
    }
    
    // Fallback to first popular show if we can't get genre information
    return popularShows[0];
  };

  // Fetch genre-based search term
  const { data: searchTerm, isLoading: termLoading } = useQuery({
    queryKey: ['recommendation-term', watchedShows],
    queryFn: () => generateSearchTerms(watchedShows),
    enabled: watchedShows.length > 0,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
  
  // Use React Query to fetch recommendations once we have a search term
  const finalSearchTerm = searchTerm || "popular tv series";
  console.log("Generated search term:", finalSearchTerm);
  
  const { data, isLoading: queryLoading, error, refetch } = useQuery({
    queryKey: ['recommendations', finalSearchTerm],
    queryFn: () => searchShows(finalSearchTerm),
    enabled: !termLoading,
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
        setHasError(true);
      }
    }
  });

  useEffect(() => {
    const fetchDetailedRecommendations = async () => {
      if (!queryLoading && data) {
        console.log("Recommendations data:", data);
        setHasError(false);
        
        // Filter out shows that the user has already watched
        const filteredShows = data.filter(
          (show: any) => !watchedShows.includes(show.imdbID)
        );
        
        try {
          // Fetch detailed information for each show (including ratings)
          const detailedShowsPromises = filteredShows.slice(0, 5).map(async (show: any) => {
            try {
              const details = await getShowDetails(show.imdbID);
              return {
                ...show,
                rating: details.imdbRating !== "N/A" ? details.imdbRating : "0.0",
                details
              };
            } catch (error) {
              console.error(`Error fetching details for ${show.Title}:`, error);
              return {
                ...show,
                rating: "0.0"
              };
            }
          });
          
          const detailedShows = await Promise.all(detailedShowsPromises);
          setRecommendedShows(detailedShows);
        } catch (error) {
          console.error("Error fetching show details:", error);
          // Fallback to shows without detailed information
          setRecommendedShows(filteredShows.slice(0, 5).map(show => ({
            ...show,
            rating: "0.0"
          })));
        } finally {
          setIsLoading(false);
        }
      } else if (!queryLoading && !data) {
        setIsLoading(false);
      }
    };
    
    fetchDetailedRecommendations();
  }, [data, queryLoading, watchedShows]);

  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);
    refetch();
  };

  // Display loading state
  if (isLoading || queryLoading || termLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (error || hasError) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertTitle>Something went wrong</AlertTitle>
        <AlertDescription>
          <p className="mb-2">Unable to load recommendations. Please try again later.</p>
          <Button variant="outline" size="sm" onClick={handleRetry} className="flex items-center gap-1 mt-2">
            <RefreshCw className="h-4 w-4" /> Retry
          </Button>
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
      {genreBasedQuery && (
        <p className="text-sm text-muted-foreground">
          Showing recommendations based on {genreBasedQuery}
        </p>
      )}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {recommendedShows.map((show: any, index: number) => (
          <ShowCard
            key={show.imdbID || index}
            id={show.imdbID || `rec-${index}`}
            title={show.Title || "Unknown Title"}
            image={show.Poster || "https://placehold.co/300x450?text=No+Image"}
            rating={show.rating || "0.0"}
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
