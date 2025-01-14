import HeroSection from "@/components/HeroSection";
import TrendingShows from "@/components/TrendingShows";

const Index = () => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <HeroSection
        title="The Last of Us"
        description="Twenty years after modern civilization has been destroyed, Joel, a hardened survivor, is hired to smuggle Ellie, a 14-year-old girl, out of an oppressive quarantine zone. What starts as a small job soon becomes a brutal, heartbreaking journey."
        backgroundImage="https://placehold.co/1920x1080"
      />
      <TrendingShows />
    </main>
  );
};

export default Index;