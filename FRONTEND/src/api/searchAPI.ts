import axios from 'axios';

// Base URL configuration (adjust the baseURL based on your Express server URL)
const api = axios.create({
  baseURL: "https://api.syntony.ai/api/", // Adjust this URL based on your backend configuration
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. Search for articles (`POST /search`)
export interface PremetaSearchCriteria {
  minCitations?: string;
  maxCitations?: string;
  startDate?: string;
  endDate?: string;
  query: string;
  include?:string[];
  filters?: any[];
  rankBy:string[];
}

export const searchGeneral = async (userId: undefined | string, resultsPerPage:number, pageNumber:number, metaSearchCriteria: PremetaSearchCriteria) => {
  try {
    const response = await api.post('/search', { "userId":userId, "resultsPerPage":resultsPerPage, "pageNumber":pageNumber, "metaSearchCriteria":metaSearchCriteria });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error searching articles');
  }
};


export const searchTopicSolely = async (q: string) => {
  try {
    const response = await api.post('/search/topic', { q });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error searching articles');
  }
};

interface getHistoryByUserIdRequest {
  user_id: string;
}

// 5. Get All Saved Folders for a User (`GET /saved-folders/user/:userId`)
export const getHistoryByUserId = async (data: getHistoryByUserIdRequest) => {
  try {
    const response = await api.post(`/search/history/`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error fetching history for user');
  }
};

