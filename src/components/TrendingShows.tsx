
import { useQuery } from "@tanstack/react-query";
import ShowCard from "./ShowCard";
import { Separator } from "./ui/separator";
import { getShowsByCategory, getShowDetails } from "@/utils/api";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";

const TrendingShows = () => {
  const categories = [
    { title: "Popular Shows", search: "stranger things", color: "from-purple-500 to-indigo-600" },
    { title: "Trending Now", search: "the last of us", color: "from-pink-500 to-purple-600" },
    { title: "Drama Series", search: "succession", color: "from-indigo-500 to-blue-600" },
    { title: "Popular Sci-Fi", search: "foundation", color: "from-blue-500 to-cyan-600" },
    { title: "Comedy Series", search: "ted lasso", color: "from-violet-500 to-fuchsia-600" },
  ];

  return (
    <div className="space-y-16 px-6 py-16 lg:px-12">
      {categories.map((category, index) => (
        <CategorySection key={category.title} {...category} index={index} />
      ))}
    </div>
  );
};

const CategorySection = ({ 
  title, 
  search, 
  color, 
  index 
}: { 
  title: string; 
  search: string; 
  color: string;
  index: number;
}) => {
  const [showsWithRatings, setShowsWithRatings] = useState<any[]>([]);
  const [isLoadingRatings, setIsLoadingRatings] = useState(false);
  const [hasError, setHasError] = useState(false);

  const { data: shows, isLoading, error, refetch } = useQuery({
    queryKey: ["shows", search],
    queryFn: () => getShowsByCategory(search),
    meta: {
      onError: (error: Error) => {
        console.error(`Error fetching ${search} shows:`, error);
        toast({
          title: "Error loading shows",
          description: "We couldn't load the latest shows. Please try again later.",
          variant: "destructive",
        });
        setHasError(true);
      }
    }
  });

  // Fetch detailed information including ratings for each show
  useEffect(() => {
    const fetchDetailedShows = async () => {
      if (!shows || shows.length === 0) return;
      
      setIsLoadingRatings(true);
      setHasError(false);
      
      try {
        // Take the first 5 shows to avoid too many requests
        const showsToFetch = shows.slice(0, 5);
        const detailedShowsPromises = showsToFetch.map(async (show: any) => {
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
        setShowsWithRatings(detailedShows);
      } catch (error) {
        console.error("Error fetching show details:", error);
        setHasError(true);
      } finally {
        setIsLoadingRatings(false);
      }
    };
    
    fetchDetailedShows();
  }, [shows]);

  const handleRetry = () => {
    setHasError(false);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (error || hasError) {
    return (
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">{title}</h2>
          <Separator className="bg-gray-800" />
        </div>
        <div className="rounded-md bg-red-950/50 p-4 text-red-200 border border-red-800/50">
          <p className="mb-2">Unable to load shows. Please try again later.</p>
          <Button variant="outline" size="sm" onClick={handleRetry} className="flex items-center gap-1">
            <RefreshCw className="h-4 w-4" /> Retry
          </Button>
        </div>
      </section>
    );
  }

  if (!shows || shows.length === 0) {
    return null;
  }

  const animationDelay = index * 0.1;
  const displayShows = showsWithRatings.length > 0 ? showsWithRatings : shows;

  return (
    <section className="space-y-8 opacity-0 animate-fade-up" style={{ animationDelay: `${animationDelay}s`, animationFillMode: 'forwards' }}>
      <div className="space-y-2">
        <h2 className={`text-3xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>{title}</h2>
        <Separator className={`h-1 w-24 rounded bg-gradient-to-r ${color}`} />
      </div>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {displayShows.map((show: any, idx: number) => (
          <ShowCard
            key={show.imdbID}
            id={show.imdbID}
            title={show.Title}
            image={show.Poster}
            rating={show.rating || show.imdbRating || "0.0"}
            year={show.Year}
            className="opacity-0 animate-fade-up"
            style={{
              animationDelay: `${idx * 0.05 + 0.3}s`,
              animationFillMode: 'forwards',
            }}
          />
        ))}
      </div>
      {isLoadingRatings && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-purple-500 mr-2" />
          <span className="text-sm text-muted-foreground">Loading ratings...</span>
        </div>
      )}
    </section>
  );
};

export default TrendingShows;
