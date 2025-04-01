
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface HeroSectionProps {
  title: string;
  description: string;
  backgroundImage: string;
}

const HeroSection = ({ title, description, backgroundImage }: HeroSectionProps) => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[80vh] w-full overflow-hidden transition-all duration-700">
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 scale-105"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
      </div>
      <div className="relative flex min-h-[80vh] items-center px-6 lg:px-12">
        <div className="max-w-2xl animate-fade-up space-y-6">
          <h1 className="text-5xl font-bold text-white md:text-7xl">
            <span className="text-gradient">{title}</span>
          </h1>
          <p className="mt-4 text-xl text-gray-200 leading-relaxed">{description}</p>
          <div className="mt-8 flex gap-4">
            <Button 
              className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white border-0 shadow-md shadow-purple-800/30 hover:shadow-lg hover:shadow-purple-800/40 transition-all duration-300 px-8 py-6 text-lg"
              onClick={() => navigate(`/show/${title}`)}
            >
              <Info className="h-5 w-5 mr-2" />
              More Info
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
