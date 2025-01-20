import { supabase } from "@/lib/supabase";

let API_KEY: string | null = null;
const BASE_URL = 'https://www.omdbapi.com/';

const getApiKey = async () => {
  if (API_KEY) return API_KEY;
  
  try {
    const { data, error } = await supabase.functions.invoke('get-omdb-key');
    if (error) throw error;
    
    API_KEY = data.OMDB_API_KEY;
    return API_KEY;
  } catch (error) {
    console.error('Error fetching OMDB API key:', error);
    throw error;
  }
};

export const searchShows = async (query: string) => {
  try {
    const apiKey = await getApiKey();
    const response = await fetch(`${BASE_URL}?apikey=${apiKey}&s=${encodeURIComponent(query)}&type=series`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.Search || [];
  } catch (error) {
    console.error('Error searching shows:', error);
    throw error;
  }
};

export const getShowDetails = async (id: string) => {
  try {
    const apiKey = await getApiKey();
    const response = await fetch(`${BASE_URL}?apikey=${apiKey}&i=${encodeURIComponent(id)}&plot=full`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting show details:', error);
    throw error;
  }
};

export const getShowsByCategory = async (category: string) => {
  try {
    const apiKey = await getApiKey();
    const response = await fetch(`${BASE_URL}?apikey=${apiKey}&s=${encodeURIComponent(category)}&type=series`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.Search || [];
  } catch (error) {
    console.error('Error getting shows by category:', error);
    throw error;
  }
};

export const getEpisodeDetails = async (id: string, season: string, episode: string) => {
  try {
    const apiKey = await getApiKey();
    const response = await fetch(`${BASE_URL}?apikey=${apiKey}&i=${encodeURIComponent(id)}&Season=${encodeURIComponent(season)}&Episode=${encodeURIComponent(episode)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting episode details:', error);
    throw error;
  }
};

export const getSeasonDetails = async (id: string, season: string) => {
  try {
    const apiKey = await getApiKey();
    const response = await fetch(`${BASE_URL}?apikey=${apiKey}&i=${encodeURIComponent(id)}&Season=${encodeURIComponent(season)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.Episodes || [];
  } catch (error) {
    console.error('Error getting season details:', error);
    throw error;
  }
};