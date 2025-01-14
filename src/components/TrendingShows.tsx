import ShowCard from "./ShowCard";
import { Separator } from "./ui/separator";

const TrendingShows = () => {
  const categories = [
    {
      title: "Trending Now",
      shows: [
        {
          title: "Breaking Bad",
          image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
          rating: "9.5",
          year: "2008",
        },
        {
          title: "Stranger Things",
          image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
          rating: "8.7",
          year: "2016",
        },
        {
          title: "The Crown",
          image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
          rating: "8.6",
          year: "2016",
        },
        {
          title: "Game of Thrones",
          image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
          rating: "9.3",
          year: "2011",
        },
      ],
    },
    {
      title: "Popular Drama Series",
      shows: [
        {
          title: "The Last of Us",
          image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1",
          rating: "9.2",
          year: "2023",
        },
        {
          title: "Better Call Saul",
          image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
          rating: "8.9",
          year: "2015",
        },
        {
          title: "The Wire",
          image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
          rating: "9.3",
          year: "2002",
        },
        {
          title: "True Detective",
          image: "https://images.unsplash.com/photo-1483058712412-4245e9b90334",
          rating: "8.9",
          year: "2014",
        },
      ],
    },
    {
      title: "Must-Watch Documentaries",
      shows: [
        {
          title: "Planet Earth",
          image: "https://images.unsplash.com/photo-1501854140801-50d01698950b",
          rating: "9.4",
          year: "2006",
        },
        {
          title: "Making a Murderer",
          image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
          rating: "8.6",
          year: "2015",
        },
        {
          title: "The Last Dance",
          image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
          rating: "9.1",
          year: "2020",
        },
        {
          title: "Chef's Table",
          image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
          rating: "8.7",
          year: "2015",
        },
      ],
    },
  ];

  return (
    <div className="space-y-12 px-6 py-12 lg:px-12">
      {categories.map((category, index) => (
        <section key={category.title} className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">{category.title}</h2>
            <Separator className="bg-gray-800" />
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
            {category.shows.map((show) => (
              <ShowCard
                key={`${show.title}-${index}`}
                {...show}
                className="animate-fade-up"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default TrendingShows;