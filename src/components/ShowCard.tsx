import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface ShowCardProps {
  id: string;
  title: string;
  image: string;
  rating: string;
  year: string;
}

const ShowCard = ({ id, title, image, rating, year }: ShowCardProps) => {
  return (
    <Link to={`/show/${id}`}>
      <Card className="overflow-hidden transition-transform hover:scale-105">
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
        </CardContent>
      </Card>
    </Link>
  );
};

export default ShowCard;