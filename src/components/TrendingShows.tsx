import { useQuery } from "@tanstack/react-query";
import ShowCard from "./ShowCard";
import { Separator } from "./ui/separator";
import { getShowsByCategory } from "@/utils/api";
import { Loader2 } from "lucide-react";

const TrendingShows = () => {
  const categories = [
    { title: "Trending Now", search: "game of thrones" },
    { title: "Popular Shows", search: "stranger things" },
    { title: "Popular Drama Series", search: "breaking bad" },
    { title: "Must-Watch Documentaries", search: "planet earth" },
  ];

  return (
    <div className="space-y-12 px-6 py-12 lg:px-12">
      {categories.map((category) => (
        <CategorySection key={category.title} {...category} />
      ))}
    </div>
  );
};

const CategorySection = ({ title, search }: { title: string; search: string }) => {
  const { data: shows, isLoading } = useQuery({
    queryKey: ["shows", search],
    queryFn: () => getShowsByCategory(search),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!shows || shows.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <Separator className="bg-gray-800" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
        {shows.map((show: any, index: number) => (
          <ShowCard
            key={show.imdbID}
            id={show.imdbID}
            title={show.Title}
            image={show.Poster}
            rating="N/A"
            year={show.Year}
            className="animate-fade-up"
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default TrendingShows;