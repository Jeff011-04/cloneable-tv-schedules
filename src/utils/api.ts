import { supabase } from "@/lib/supabase";

const BASE_URL = 'https://www.omdbapi.com/';

const getApiKey = async () => {
  const { data: { OMDB_API_KEY }, error } = await supabase
    .from('secrets')
    .select('OMDB_API_KEY')
    .single();

  if (error) {
    console.error('Error fetching API key:', error);
    throw new Error('Failed to fetch API key');
  }

  return OMDB_API_KEY;
};

export const searchShows = async (query: string) => {
  const API_KEY = await getApiKey();
  const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&s=${query}&type=series`);
  const data = await response.json();
  return data.Search || [];
};

export const getShowDetails = async (id: string) => {
  const API_KEY = await getApiKey();
  const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&i=${id}&plot=full`);
  const data = await response.json();
  return data;
};

export const getShowsByCategory = async (category: string) => {
  const API_KEY = await getApiKey();
  const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&s=${category}&type=series`);
  const data = await response.json();
  return data.Search || [];
};