import { useQuery } from "@tanstack/react-query";
import HeroSection from "@/components/HeroSection";
import TrendingShows from "@/components/TrendingShows";
import { getShowDetails } from "@/utils/api";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

const FEATURED_SHOWS = ["tt0108778", "tt0944947", "tt0903747"]; // Friends, Game of Thrones, Breaking Bad

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentShowIndex, setCurrentShowIndex] = useState(0);

  const { data: currentShow, isLoading } = useQuery({
    queryKey: ["show", FEATURED_SHOWS[currentShowIndex]],
    queryFn: () => getShowDetails(FEATURED_SHOWS[currentShowIndex]),
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentShowIndex((prev) => (prev + 1) % FEATURED_SHOWS.length);
    }, 5000); // Change show every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleDeleteAccount = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_deleted: true })
        .eq('id', user?.id);

      if (error) throw error;

      await supabase.auth.signOut();
      navigate('/login');
      toast({
        title: "Account deleted",
        description: "Your account has been successfully deleted.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete account. Please try again.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      {user && (
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">
              Welcome back, {user.user_metadata.name || 'User'}!
            </h2>
            <Button 
              variant="destructive" 
              onClick={handleDeleteAccount}
              className="ml-4"
            >
              Delete Account
            </Button>
          </div>
        </div>
      )}
      <HeroSection
        title={currentShow?.Title || "Loading..."}
        description={currentShow?.Plot || "Loading..."}
        backgroundImage={currentShow?.Poster || "https://placehold.co/1920x1080"}
      />
      <TrendingShows />
    </main>
  );
};

export default Index;