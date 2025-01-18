const API_KEY = 'e48b38b2';
const BASE_URL = 'https://www.omdbapi.com/';

export const searchShows = async (query: string) => {
  const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&s=${query}&type=series`);
  const data = await response.json();
  return data.Search || [];
};

export const getShowDetails = async (id: string) => {
  const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&i=${id}&plot=full`);
  const data = await response.json();
  return data;
};

export const getShowsByCategory = async (category: string) => {
  const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&s=${category}&type=series`);
  const data = await response.json();
  return data.Search || [];
};

export const getEpisodeDetails = async (id: string, season: string, episode: string) => {
  const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&i=${id}&Season=${season}&Episode=${episode}`);
  const data = await response.json();
  return data;
};