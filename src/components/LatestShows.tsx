
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getLatestShows } from '@/utils/api';
import ShowCard from './ShowCard';
import { Separator } from './ui/separator';
import { Loader2 } from 'lucide-react';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem,
  PaginationNext,
  PaginationPrevious 
} from './ui/pagination';

type TimeFilter = {
  year: string;
  month: string | null;
  label: string;
};

const LatestShows = () => {
  const [timeFilters, setTimeFilters] = useState<TimeFilter[]>([]);
  const [currentFilterIndex, setCurrentFilterIndex] = useState(0);
  
  // Generate time filters for current month and previous months
  useEffect(() => {
    const generateTimeFilters = () => {
      const filters: TimeFilter[] = [];
      const today = new Date();
      
      // Current month
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth() + 1; // JavaScript months are 0-based
      
      // Add current month
      filters.push({
        year: currentYear.toString(),
        month: currentMonth.toString(),
        label: `${new Date(currentYear, currentMonth - 1).toLocaleString('default', { month: 'long' })} ${currentYear}`
      });
      
      // Add previous 5 months
      for (let i = 1; i <= 5; i++) {
        let year = currentYear;
        let month = currentMonth - i;
        
        if (month <= 0) {
          month = 12 + month;
          year = currentYear - 1;
        }
        
        filters.push({
          year: year.toString(),
          month: month.toString(),
          label: `${new Date(year, month - 1).toLocaleString('default', { month: 'long' })} ${year}`
        });
      }
      
      // Add current year (all months)
      filters.push({
        year: currentYear.toString(),
        month: null,
        label: `All of ${currentYear}`
      });
      
      // Add previous year
      filters.push({
        year: (currentYear - 1).toString(),
        month: null,
        label: `All of ${currentYear - 1}`
      });
      
      setTimeFilters(filters);
    };
    
    generateTimeFilters();
  }, []);
  
  const currentFilter = timeFilters[currentFilterIndex] || { year: new Date().getFullYear().toString(), month: null, label: "Latest Shows" };
  
  const { data: shows, isLoading, error, isError } = useQuery({
    queryKey: ['latestShows', currentFilter.year, currentFilter.month],
    queryFn: () => getLatestShows(currentFilter.year, currentFilter.month || ""),
    enabled: !!timeFilters.length,
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
  
  if (timeFilters.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }
  
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
        <div className="rounded-md bg-red-950/50 p-4 text-red-200 border border-red-800/50">
          Unable to load shows. Please try again later.
        </div>
      ) : shows && shows.length > 0 ? (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {shows.map((show: any, idx: number) => (
            <ShowCard
              key={show.imdbID}
              id={show.imdbID}
              title={show.Title}
              image={show.Poster}
              rating="N/A"
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
          <p>No shows found for this time period. Try another time filter.</p>
        </div>
      )}
    </div>
  );
};

export default LatestShows;
