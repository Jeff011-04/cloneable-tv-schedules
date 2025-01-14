import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const Show = () => {
  const { id } = useParams();

  // This would typically fetch show data based on the ID
  const show = {
    title: "Breaking Bad",
    description: "A high school chemistry teacher turned methamphetamine manufacturer partners with a former student to secure his family's financial future as he battles terminal lung cancer.",
    backgroundImage: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    rating: "9.5",
    year: "2008",
    episodes: [
      { id: 1, title: "Pilot", duration: "58m" },
      { id: 2, title: "Cat's in the Bag...", duration: "48m" },
      { id: 3, title: "...And the Bag's in the River", duration: "48m" },
    ],
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="relative min-h-[70vh] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${show.backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        </div>
        <div className="relative flex min-h-[70vh] flex-col justify-between p-6 lg:p-12">
          <Link to="/">
            <Button variant="ghost" className="w-fit gap-2 text-white">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold text-white md:text-6xl">{show.title}</h1>
            <div className="mt-2 flex gap-2 text-gray-300">
              <span>{show.rating}</span>
              <span>•</span>
              <span>{show.year}</span>
            </div>
            <p className="mt-4 text-lg text-gray-200">{show.description}</p>
            <div className="mt-8 flex gap-4">
              <Button className="gap-2">
                <Play className="h-5 w-5" />
                Play
              </Button>
              <Button variant="secondary" className="gap-2">
                <Plus className="h-5 w-5" />
                My List
              </Button>
            </div>
          </div>
        </div>
      </div>
      <section className="p-6 lg:p-12">
        <h2 className="mb-6 text-2xl font-semibold">Episodes</h2>
        <div className="space-y-4">
          {show.episodes.map((episode) => (
            <div
              key={episode.id}
              className="flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent"
            >
              <div>
                <h3 className="font-medium">{episode.title}</h3>
                <p className="text-sm text-muted-foreground">{episode.duration}</p>
              </div>
              <Button variant="ghost" size="icon">
                <Play className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Show;