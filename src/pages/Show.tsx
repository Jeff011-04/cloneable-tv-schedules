import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getShowDetails } from "@/utils/api";
import { Loader2, Star, Calendar, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Show = () => {
  const { id } = useParams();

  const { data: show, isLoading } = useQuery({
    queryKey: ["show", id],
    queryFn: () => getShowDetails(id || ""),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!show) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-muted-foreground">Show not found</p>
      </div>
    );
  }

  // Safely handle potentially undefined values
  const genres = show.Genre ? show.Genre.split(", ") : [];

  return (
    <div className="min-h-screen bg-background">
      <div
        className="relative h-[50vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${show.Poster})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 md:p-12">
          <h1 className="text-4xl font-bold text-white md:text-6xl">
            {show.Title || "Untitled"}
          </h1>
          <div className="mt-4 flex flex-wrap gap-4 text-white">
            {show.imdbRating && (
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400" />
                <span>{show.imdbRating}/10</span>
              </div>
            )}
            {show.Year && (
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>{show.Year}</span>
              </div>
            )}
            {show.Runtime && (
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>{show.Runtime}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl p-6 md:p-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-semibold">Plot</h2>
            <p className="mt-4 text-muted-foreground">{show.Plot || "No plot available"}</p>

            <Separator className="my-8" />

            <h2 className="text-2xl font-semibold">Cast</h2>
            <p className="mt-4 text-muted-foreground">{show.Actors || "Cast information not available"}</p>

            <Separator className="my-8" />

            <h2 className="text-2xl font-semibold">Genre</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {genres.map((genre: string) => (
                <span
                  key={genre}
                  className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>

          <div>
            <img
              src={show.Poster || "/placeholder.svg"}
              alt={show.Title || "Show poster"}
              className="w-full rounded-lg shadow-xl"
            />
            <div className="mt-6 space-y-4">
              <div>
                <h3 className="font-semibold">Director</h3>
                <p className="text-muted-foreground">{show.Director || "Not available"}</p>
              </div>
              <div>
                <h3 className="font-semibold">Writer</h3>
                <p className="text-muted-foreground">{show.Writer || "Not available"}</p>
              </div>
              <div>
                <h3 className="font-semibold">Awards</h3>
                <p className="text-muted-foreground">{show.Awards || "No awards information"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Show;