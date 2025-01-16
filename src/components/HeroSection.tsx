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
    <div className="relative min-h-[70vh] w-full overflow-hidden transition-all duration-500">
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-500"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
      </div>
      <div className="relative flex min-h-[70vh] items-center px-6 lg:px-12">
        <div className="max-w-2xl animate-fade-up">
          <h1 className="text-4xl font-bold text-white md:text-6xl">{title}</h1>
          <p className="mt-4 text-lg text-gray-200">{description}</p>
          <div className="mt-8">
            <Button 
              variant="secondary" 
              className="gap-2"
              onClick={() => navigate(`/show/${title}`)}
            >
              <Info className="h-5 w-5" />
              More Info
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;