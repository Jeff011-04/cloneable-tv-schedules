
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, History, LogOut, LogIn, UserPlus, Home } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 bg-background/40 backdrop-blur-md border-b border-white/10">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
        <Link to="/" className="text-xl font-bold flex items-center gap-2 group">
          <span className="text-purple-500 group-hover:text-purple-400 transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M10 9L15 12L10 15V9Z" fill="currentColor"/>
            </svg>
          </span>
          <span className="text-gradient">TV Lists</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <Button
            variant={isActive("/") ? "secondary" : "ghost"}
            size="icon"
            onClick={() => navigate("/")}
            className="rounded-full hover:bg-purple-500/20 transition-colors"
          >
            <Home className="h-5 w-5" />
          </Button>
          
          <Button
            variant={isActive("/search") ? "secondary" : "ghost"}
            size="icon"
            onClick={() => navigate("/search")}
            className="rounded-full hover:bg-purple-500/20 transition-colors"
          >
            <Search className="h-5 w-5" />
          </Button>
          
          {user ? (
            <>
              <Button
                variant={isActive("/watch-history") ? "secondary" : "ghost"}
                size="icon"
                onClick={() => navigate("/watch-history")}
                className="rounded-full hover:bg-purple-500/20 transition-colors"
              >
                <History className="h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                onClick={handleSignOut}
                className="ml-2 border-white/10 hover:bg-purple-500/20 hover:text-white transition-colors gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/login")}
                className="hover:bg-purple-500/20 transition-colors gap-2"
              >
                <LogIn className="h-4 w-4" />
                Sign in
              </Button>
              <Button 
                onClick={() => navigate("/signup")}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 border-0 gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Sign up
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
