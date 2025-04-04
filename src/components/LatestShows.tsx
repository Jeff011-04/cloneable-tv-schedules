
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getLatestShows } from '@/utils/api';
import ShowCard from './ShowCard';
import { Separator } from './ui/separator';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { RefreshCcw } from 'lucide-react';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem,
  PaginationNext,
  PaginationPrevious 
} from './ui/pagination';
import { Button } from './ui/button';

type TimeFilter = {
  label: string;
  type: 'popular' | 'trending' | 'acclaimed';
};

const LatestShows = () => {
  const [timeFilters, setTimeFilters] = useState<TimeFilter[]>([
    { label: 'Popular Shows', type: 'popular' },
    { label: 'Trending Shows', type: 'trending' },
    { label: 'Acclaimed Series', type: 'acclaimed' }
  ]);
  const [currentFilterIndex, setCurrentFilterIndex] = useState(0);
  
  const currentFilter = timeFilters[currentFilterIndex];
  
  const { 
    data: shows,
    isLoading,
    error,
    isError,
    refetch
  } = useQuery({
    queryKey: ['latestShows', currentFilter.type],
    queryFn: () => getLatestShows(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
  
  const navigateFilter = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentFilterIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else {
      setCurrentFilterIndex(prev => (prev < timeFilters.length - 1 ? prev + 1 : prev));
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">{currentFilter.label}</h3>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => navigateFilter('prev')}
                className={currentFilterIndex === 0 ? "opacity-50 pointer-events-none" : "cursor-pointer"}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext 
                onClick={() => navigateFilter('next')}
                className={currentFilterIndex === timeFilters.length - 1 ? "opacity-50 pointer-events-none" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
        </div>
      ) : isError ? (
        <Alert variant="destructive" className="bg-red-950/50 border border-red-800/50">
          <div className="flex justify-between items-center">
            <div>
              <AlertTitle>Unable to load shows</AlertTitle>
              <AlertDescription>We couldn't fetch the latest shows. Please try again.</AlertDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refetch()}
              className="border-red-400 text-red-400 hover:bg-red-950"
            >
              <RefreshCcw className="h-4 w-4 mr-2" /> Retry
            </Button>
          </div>
        </Alert>
      ) : shows && shows.length > 0 ? (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {shows.map((show: any, idx: number) => (
            <ShowCard
              key={show.imdbID}
              id={show.imdbID}
              title={show.Title}
              image={show.Poster}
              rating={show.imdbRating || "N/A"}
              year={show.Year}
              className="opacity-0 animate-fade-up"
              style={{
                animationDelay: `${idx * 0.05 + 0.3}s`,
                animationFillMode: 'forwards',
              }}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-md bg-secondary/30 p-6 text-center">
          <p>No shows found. Try another filter or check back later.</p>
        </div>
      )}
    </div>
  );
};

export default LatestShows;
