const
 
API_KEY
 
=
 
'e48b38b2'
;

const BASE_URL = 'https://www.omdbapi.com/';



export const searchShows = async (query: string) => {
  try {
  
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