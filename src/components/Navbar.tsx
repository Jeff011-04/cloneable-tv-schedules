import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, History } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Success",
        description: "You have been signed out successfully",
      });
      navigate("/login");
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out. Please try again.",
      });
    }
  };

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
        <Link to="/" className="text-xl font-bold">
          TV Lists
        </Link>
        
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/search")}
            className="rounded-full"
          >
            <Search className="h-5 w-5" />
          </Button>
          
          {user ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/watch-history")}
                className="rounded-full"
              >
                <History className="h-5 w-5" />
              </Button>
              <Button variant="ghost" onClick={handleSignOut}>
                Sign out
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => navigate("/login")}>
                Sign in
              </Button>
              <Button onClick={() => navigate("/signup")}>Sign up</Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;