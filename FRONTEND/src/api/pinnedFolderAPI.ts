import axios from 'axios';

// Base URL configuration (adjust the baseURL based on your Express server URL)
const api = axios.create({
  baseURL: "https://api.syntony.ai/api/pinned_folder", // Adjust this URL based on your backend configuration
  headers: {
    'Content-Type': 'application/json',
  },
});

interface PinnedFolder {
  pin_id: string;
  user_id: string;
  folder_id: string;
  created_at: string; // Optional: if your API returns a timestamp for when the folder was pinned
}

// 1. Add a Pinned Folder (`POST /pinned_folder/add`)
interface AddPinnedFolderRequest {
  user_id: string;
  folder_id: string;
}

export const addPinnedFolder = async (data: AddPinnedFolderRequest) => {
  try {
    const response = await api.post('/add', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error adding pinned folder');
  }
};

// 2. Remove a Pinned Folder (`DELETE /pinned_folder/remove`)
interface RemovePinnedFolderRequest {
  user_id: string;
  folder_id: string;
}

export const removePinnedFolder = async (data: RemovePinnedFolderRequest) => {
  try {
    const response = await api.delete('/remove', { data });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error removing pinned folder');
  }
};

// 3. Get All Pinned Folders for a User (`GET /pinned_folder/user/:user_id`)
export const getPinnedFoldersByUserId = async (user_id: string): Promise<PinnedFolder[]> => {
  try {
    const response = await api.post(`/user/${user_id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error fetching pinned folders for user');
  }
};
