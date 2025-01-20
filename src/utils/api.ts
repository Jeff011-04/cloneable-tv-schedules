const API_KEY = 'e48b38b2';
const BASE_URL = 'https://www.omdbapi.com/';

export const searchShows = async (query: string) => {
  try {
    const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&type=series`);
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
    const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&i=${encodeURIComponent(id)}&plot=full`);
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
    const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(category)}&type=series`);
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
    const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&i=${encodeURIComponent(id)}&Season=${encodeURIComponent(season)}&Episode=${encodeURIComponent(episode)}`);
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
    const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&i=${encodeURIComponent(id)}&Season=${encodeURIComponent(season)}`);
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