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
  try {
    const API_KEY = await getApiKey();
    const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&s=${query}&type=series`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.Search || [];
  } catch (error) {
    console.error('Search shows error:', error);
    throw error;
  }
};

export const getShowDetails = async (id: string) => {
  try {
    const API_KEY = await getApiKey();
    const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&i=${id}&plot=full`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Get show details error:', error);
    throw error;
  }
};

export const getShowsByCategory = async (category: string) => {
  try {
    const API_KEY = await getApiKey();
    const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&s=${category}&type=series`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.Search || [];
  } catch (error) {
    console.error('Get shows by category error:', error);
    throw error;
  }
};