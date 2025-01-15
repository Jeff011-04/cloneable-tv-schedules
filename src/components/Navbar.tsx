import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
        <Link to="/" className="text-xl font-bold">
          TV Times
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
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => navigate("/login")}>
              Sign in
            </Button>
            <Button onClick={() => navigate("/signup")}>Sign up</Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;