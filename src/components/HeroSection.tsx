import { Button } from "@/components/ui/button";
import { Play, Info } from "lucide-react";

interface HeroSectionProps {
  title: string;
  description: string;
  backgroundImage: string;
}

const HeroSection = ({ title, description, backgroundImage }: HeroSectionProps) => {
  return (
    <div className="relative min-h-[70vh] w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
      </div>
      <div className="relative flex min-h-[70vh] items-center px-6 lg:px-12">
        <div className="max-w-2xl animate-fade-up">
          <h1 className="text-4xl font-bold text-white md:text-6xl">{title}</h1>
          <p className="mt-4 text-lg text-gray-200">{description}</p>
          <div className="mt-8 flex gap-4">
            <Button className="gap-2">
              <Play className="h-5 w-5" />
              Play Now
            </Button>
            <Button variant="secondary" className="gap-2">
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