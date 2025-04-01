
import { useQuery } from "@tanstack/react-query";
import ShowCard from "./ShowCard";
import { Separator } from "./ui/separator";
import { getShowsByCategory } from "@/utils/api";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

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
  const { data: shows, isLoading, error } = useQuery({
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
      }
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (error) {
    return (
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">{title}</h2>
          <Separator className="bg-gray-800" />
        </div>
        <div className="rounded-md bg-red-950/50 p-4 text-red-200 border border-red-800/50">
          Unable to load shows. Please try again later.
        </div>
      </section>
    );
  }

  if (!shows || shows.length === 0) {
    return null;
  }

  const animationDelay = index * 0.1;

  return (
    <section className="space-y-8 opacity-0 animate-fade-up" style={{ animationDelay: `${animationDelay}s`, animationFillMode: 'forwards' }}>
      <div className="space-y-2">
        <h2 className={`text-3xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>{title}</h2>
        <Separator className={`h-1 w-24 rounded bg-gradient-to-r ${color}`} />
      </div>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {shows.map((show: any, idx: number) => (
          <ShowCard
            key={show.imdbID}
            id={show.imdbID}
            title={show.Title}
            image={show.Poster}
            rating="N/A"
            year={show.Year}
            className="opacity-0 animate-fade-up"
            style={{
              animationDelay: `${idx * 0.05 + 0.3}s`,
              animationFillMode: 'forwards',
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default TrendingShows;
