
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
    // Extract meaningful keywords from show titles
    const keywords = showTitles
      .flatMap(title => title.split(/\s+/))
      .filter(word => word.length > 3)
      .filter(word => !['the', 'and', 'season', 'show'].includes(word.toLowerCase()));
    
    // If we have enough keywords, use random selection of them
    if (keywords.length > 2) {
      const randomKeywords = [...new Set(keywords)]
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      return randomKeywords.join(' ');
    }
    
    // Fallback to the first show title if not enough keywords
    return showTitles[0] || "popular shows";
  };

  // Use React Query to fetch recommendations
  const searchTerm = generateSearchTerms(watchedShows);
  const { data, isLoading: queryLoading, error } = useQuery({
    queryKey: ['recommendations', searchTerm],
    queryFn: () => searchShows(searchTerm),
    enabled: watchedShows.length > 0,
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
    <div className="mt-8 space-y-4">
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
