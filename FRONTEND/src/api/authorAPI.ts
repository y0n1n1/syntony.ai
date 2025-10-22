import axios from 'axios';

// Base URL configuration (adjust the baseURL based on your Express server URL)
const api = axios.create({
  baseURL: "https://api.syntony.ai/api/author", // Adjust this URL based on your backend configuration
  headers: {
    'Content-Type': 'application/json',
  },
});



// 4. Get Messages Between Two Users (`GET /messages/between/:userId1/:userId2`)
export const getArticlesIdsByAuthorId = async (author_id: string) => {
    try {
      const response = await api.post(`/articles-by-author/${author_id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Error getting article ids by author id');
    }
  };
  

export const getAuthorIdByAuthorName = async (author_name: string) => {
  try {
    const response = await api.post(`/author-id-by-name/${author_name}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error creating message');
  }
};

export const getAuthorNameByAuthorId = async (author_id: string) => {
  try {
    const response = await api.post(`/author-name-by-id/${author_id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error creating message');
  }
};

export const getAuthorIdsByArticleId = async (article_id: string) => {
  try {
    const response = await api.put(`/authors-by-article/${article_id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error updating message');
  }
};
