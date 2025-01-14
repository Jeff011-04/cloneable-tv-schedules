import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ShowCard from "@/components/ShowCard";
import { searchShows } from "@/utils/api";
import { Loader2 } from "lucide-react";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");

  const { data: shows, isLoading } = useQuery({
    queryKey: ["shows", debouncedTerm],
    queryFn: () => searchShows(debouncedTerm),
    enabled: debouncedTerm.length > 2,
  });

  const handleSearch = () => {
    setDebouncedTerm(searchTerm);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex gap-4">
          <Input
            placeholder="Search for TV shows..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        )}

        {shows && shows.length > 0 && (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {shows.map((show: any) => (
              <ShowCard
                key={show.imdbID}
                title={show.Title}
                image={show.Poster}
                rating="N/A"
                year={show.Year}
              />
            ))}
          </div>
        )}

        {shows && shows.length === 0 && debouncedTerm && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No shows found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;