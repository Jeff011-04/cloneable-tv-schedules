import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ShowCardProps {
  id: string;
  title: string;
  image: string;
  rating: string;
  year: string;
  className?: string;
  style?: React.CSSProperties;
}

const ShowCard = ({ id, title, image, rating, year, className, style }: ShowCardProps) => {
  return (
    <Card className={cn("overflow-hidden transition-transform hover:scale-105", className)} style={style}>
      <div className="aspect-[2/3] relative">
        <img
          src={image !== "N/A" ? image : "https://placehold.co/300x450?text=No+Image"}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold line-clamp-1">{title}</h3>
        <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400" />
            <span>{rating}</span>
          </div>
          <span>{year}</span>
        </div>
        <Link to={`/show/${id}`} className="mt-3 block">
          <Button className="w-full" variant="secondary">
            <Info className="mr-2 h-4 w-4" />
            More Info
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default ShowCard;