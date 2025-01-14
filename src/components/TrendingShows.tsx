import ShowCard from "./ShowCard";

const TrendingShows = () => {
  const shows = [
    {
      title: "Breaking Bad",
      image: "https://placehold.co/400x600",
      rating: "9.5",
      year: "2008",
    },
    {
      title: "Stranger Things",
      image: "https://placehold.co/400x600",
      rating: "8.7",
      year: "2016",
    },
    {
      title: "The Crown",
      image: "https://placehold.co/400x600",
      rating: "8.6",
      year: "2016",
    },
    {
      title: "Game of Thrones",
      image: "https://placehold.co/400x600",
      rating: "9.3",
      year: "2011",
    },
  ];

  return (
    <section className="px-6 py-12 lg:px-12">
      <h2 className="mb-6 text-2xl font-semibold">Trending Now</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {shows.map((show) => (
          <ShowCard key={show.title} {...show} />
        ))}
      </div>
    </section>
  );
};

export default TrendingShows;