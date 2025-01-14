import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";
import ShowCard from "@/components/ShowCard";

const Search = () => {
  // This would typically be connected to a search API
  const searchResults = [
    {
      title: "Breaking Bad",
      image: "https://placehold.co/400x600",
      rating: "9.5",
      year: "2008",
    },
    {
      title: "Better Call Saul",
      image: "https://placehold.co/400x600",
      rating: "8.8",
      year: "2015",
    },
  ];

  return (
    <main className="min-h-screen bg-background p-6 lg:p-12">
      <div className="relative mb-8">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search for shows..."
          className="pl-10"
        />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {searchResults.map((show) => (
          <ShowCard key={show.title} {...show} />
        ))}
      </div>
    </main>
  );
};

export default Search;