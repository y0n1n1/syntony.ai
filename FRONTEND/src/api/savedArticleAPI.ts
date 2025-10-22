import axios from 'axios';

// Base URL configuration (adjust the baseURL based on your Express server URL)
const api = axios.create({
  baseURL: "https://api.syntony.ai/api/saved_article", // Adjust this URL based on your backend configuration
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. Add a New Saved Article (`POST /add`)
interface CreateSavedArticleRequest {
  folder_id: string;
  article_id: string;
  user_id: string;
}

export const createSavedArticle = async (data: CreateSavedArticleRequest) => {
  try {
    const response = await api.post('/add', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error adding saved article');
  }
};

// 2. Get Folders by Article ID and User ID (`POST /article/:article_id/user/:user_id`)
export const getFoldersByUserIdArticleId = async (article_id: string, user_id: string) => {
  try {
    const response = await api.post(`/article/${article_id}/user/${user_id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error fetching folders by article ID');
  }
};

// 3. Delete a Saved Article by Article and Folder ID (`DELETE /delete`)
interface DeleteSavedArticleRequest {
  article_id: string;
  folder_id: string;
}

export const deleteSavedArticle = async (data: DeleteSavedArticleRequest) => {
  try {
    const response = await api.delete('/delete', { data });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error deleting saved article');
  }
};

// 4. Get All Saved Articles for a Folder by Folder ID (`GET /folder/:folder_id`)
export const getSavedArticlesByFolderId = async (folder_id: string) => {
    console.log("CALLED getSavedArticlesByFolderId")
    console.log(folder_id)
  try {
    const response = await api.post(`/folder/${folder_id}`);
    console.log(response.data)
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error fetching saved articles by folder ID');
  }
};
