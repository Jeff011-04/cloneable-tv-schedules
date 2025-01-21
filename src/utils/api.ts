import { supabase } from "@/lib/supabase";

let API_KEY: string | null = null;
const BASE_URL = 'https://www.omdbapi.com/';

const getApiKey = async () => {
  if (API_KEY) return API_KEY;
  
  try {
    const { data, error } = await supabase.functions.invoke('get-omdb-key', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (error) throw error;
    
    API_KEY = data.OMDB_API_KEY;
    return API_KEY;
  } catch (error) {
    console.error('Error fetching OMDB API key:', error);
    throw error;
  }
};

const fetchWithRetry = async (url: string, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.Error) {
        throw new Error(data.Error);
      }
      return data;
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      if (i === retries - 1) throw error;
      // Exponential backoff: wait longer between each retry
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
};

export const searchShows = async (query: string) => {
  try {
    const apiKey = await getApiKey();
    const url = `${BASE_URL}?apikey=${apiKey}&s=${encodeURIComponent(query)}&type=series`;
    const data = await fetchWithRetry(url);
    return data.Search || [];
  } catch (error) {
    console.error('Error searching shows:', error);
    throw error;
  }
};

export const getShowDetails = async (id: string) => {
  try {
    const apiKey = await getApiKey();
    const url = `${BASE_URL}?apikey=${apiKey}&i=${encodeURIComponent(id)}&plot=full`;
    return await fetchWithRetry(url);
  } catch (error) {
    console.error('Error getting show details:', error);
    throw error;
  }
};

export const getShowsByCategory = async (category: string) => {
  try {
    const apiKey = await getApiKey();
    const url = `${BASE_URL}?apikey=${apiKey}&s=${encodeURIComponent(category)}&type=series`;
    const data = await fetchWithRetry(url);
    return data.Search || [];
  } catch (error) {
    console.error('Error getting shows by category:', error);
    throw error;
  }
};

export const getEpisodeDetails = async (id: string, season: string, episode: string) => {
  try {
    const apiKey = await getApiKey();
    const url = `${BASE_URL}?apikey=${apiKey}&i=${encodeURIComponent(id)}&Season=${encodeURIComponent(season)}&Episode=${encodeURIComponent(episode)}`;
    return await fetchWithRetry(url);
  } catch (error) {
    console.error('Error getting episode details:', error);
    throw error;
  }
};

export const getSeasonDetails = async (id: string, season: string) => {
  try {
    const apiKey = await getApiKey();
    const url = `${BASE_URL}?apikey=${apiKey}&i=${encodeURIComponent(id)}&Season=${encodeURIComponent(season)}`;
    const data = await fetchWithRetry(url);
    return data.Episodes || [];
  } catch (error) {
    console.error('Error getting season details:', error);
    throw error;
  }
};