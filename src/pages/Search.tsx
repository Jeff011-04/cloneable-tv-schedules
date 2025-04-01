
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ShowCard from "@/components/ShowCard";
import { searchShows } from "@/utils/api";
import { Loader2, Search as SearchIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.length > 2) {
        setDebouncedTerm(searchTerm);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: shows, isLoading, error } = useQuery({
    queryKey: ["shows", debouncedTerm],
    queryFn: () => searchShows(debouncedTerm),
    enabled: debouncedTerm.length > 2,
    meta: {
      onError: (error: Error) => {
        console.error('Search error:', error);
        toast({
          title: "Search error",
          description: "We couldn't complete your search. Please try again.",
          variant: "destructive",
        });
      }
    }
  });

  const handleSearch = () => {
    if (searchTerm.length > 2) {
      setDebouncedTerm(searchTerm);
    } else {
      toast({
        title: "Search term too short",
        description: "Please enter at least 3 characters to search",
        variant: "destructive",
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search for TV shows..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Search
          </Button>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          </div>
        )}

        {error && (
          <div className="rounded-md bg-red-950/50 p-4 text-red-200 border border-red-800/50 mb-6">
            Unable to complete your search. Please try a different search term.
          </div>
        )}

        {shows && shows.length > 0 && (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {shows.map((show: any) => (
              <ShowCard
                key={show.imdbID}
                id={show.imdbID}
                title={show.Title}
                image={show.Poster}
                rating={show.imdbRating || "N/A"}
                year={show.Year}
              />
            ))}
          </div>
        )}

        {shows && shows.length === 0 && debouncedTerm && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No shows found</p>
            <p className="text-sm text-muted-foreground mt-2">Try a different search term</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
