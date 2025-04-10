
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

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
  // Format rating to handle edge cases
  const formattedRating = rating === "N/A" ? "0.0" : rating;
  const displayRating = formattedRating === "0.0" ? "-" : formattedRating;
  
  // Determine rating color
  const ratingValue = parseFloat(formattedRating);
  const ratingColor = 
    ratingValue >= 8 ? "text-green-400" : 
    ratingValue >= 6 ? "text-yellow-400" : 
    ratingValue > 0 ? "text-orange-400" : 
    "text-gray-400";

  return (
    <Link to={`/show/${id}`}>
      <Card 
        className={cn(
          "overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-md bg-card/60 backdrop-blur-sm border-white/5",
          className
        )} 
        style={style}
      >
        <div className="aspect-[2/3] relative group">
          <img
            src={image !== "N/A" ? image : "https://placehold.co/300x450?text=No+Image"}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <h3 className="font-bold text-white text-lg line-clamp-2">{title}</h3>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold line-clamp-1">{title}</h3>
          <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className={`h-4 w-4 ${ratingColor} ${ratingValue > 0 ? "fill-current" : ""}`} />
              <span className={ratingColor}>{displayRating}</span>
            </div>
            <span className="font-medium text-purple-400">{year}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ShowCard;
