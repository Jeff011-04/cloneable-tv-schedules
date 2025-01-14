import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ShowCardProps {
  title: string;
  image: string;
  rating: string;
  year: string;
  className?: string;
}

const ShowCard = ({ title, image, rating, year, className }: ShowCardProps) => {
  return (
    <Card className={cn(
      "group relative overflow-hidden rounded-lg transition-all duration-300 hover:scale-105",
      className
    )}>
      <div className="aspect-[2/3] w-full overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 transition-all duration-300 group-hover:opacity-100">
        <h3 className="text-lg font-semibold leading-tight">{title}</h3>
        <div className="mt-1 flex items-center gap-2 text-sm">
          <span>{rating}</span>
          <span>•</span>
          <span>{year}</span>
        </div>
      </div>
    </Card>
  );
};

export default ShowCard;