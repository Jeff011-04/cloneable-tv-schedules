import { useQuery } from "@tanstack/react-query";
import HeroSection from "@/components/HeroSection";
import TrendingShows from "@/components/TrendingShows";
import { getShowDetails } from "@/utils/api";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { data: friendsShow, isLoading } = useQuery({
    queryKey: ["show", "tt0108778"],
    queryFn: () => getShowDetails("tt0108778"), // Friends IMDB ID
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <HeroSection
        title={friendsShow?.Title || "Friends"}
        description={
          friendsShow?.Plot ||
          "Follow the lives of six reckless adults living in Manhattan, as they indulge in adventures which make their lives both troublesome and happening."
        }
        backgroundImage={
          friendsShow?.Poster || "https://placehold.co/1920x1080"
        }
      />
      <TrendingShows />
    </main>
  );
};

export default Index;