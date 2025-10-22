import axios from 'axios';

// Base URL configuration (adjust the baseURL based on your Express server URL)
const api = axios.create({
  baseURL: "https://api.syntony.ai/api/saved_folder", // Adjust this URL based on your backend configuration
  headers: {
    'Content-Type': 'application/json',
  },
});

type NonEmptyArray<T> = [T, ...T[]];

// 1. Create a New Saved Folder (`POST /saved-folders`)
interface CreateSavedFolderRequest {
  user_id: string; // Updated to new naming convention
  folder_name: string; // Updated to new naming convention
  description?: string; // Optional field for description
  is_public?: boolean; // Optional field for public status
}

export const createSavedFolder = async (data: CreateSavedFolderRequest) => {
  try {
    const response = await api.post('/create', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error creating saved folder');
  }
};

// 2. Get Saved Folder by ID (`GET /saved-folders/:id`)
export const getSavedFolderById = async (folder_id: string):Promise<Folder> => {
  try {
    const response = await api.get(`/${folder_id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error fetching saved folder');
  }
};

// 3. Update Saved Folder (`PUT /saved-folders/:id`)
interface UpdateSavedFolderRequest {
  folder_id: string; // Updated to new naming convention
  folder_name?: string; // Optional update for folder name
  description?: string; // Optional field for description
  is_public?: boolean; // Optional field for public status
}

export const updateSavedFolder = async (data: UpdateSavedFolderRequest) => {
  try {
    const response = await api.put(`/update`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error updating saved folder');
  }
};

export interface Folder {
  folder_id: string;
  title: string;
  date: string;
  articleCount: number;
  isPinned: boolean;
  isSelected: boolean;
}

// 4. Delete Saved Folder by ID (`DELETE /saved-folders/:id`)
interface DeleteSavedFolderRequest {
  folder_id: string; // Updated to new naming convention
}

export const deleteSavedFolder = async (data: DeleteSavedFolderRequest) => {
  try {
    const response = await api.post(`/delete`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error deleting saved folder');
  }
};

// 5. Get All Saved Folders for a User (`GET /saved-folders/user/:userId`)
export const getSavedFoldersByUserId = async (user_id: string): Promise<NonEmptyArray<Folder>> => {
  try {
    const response = await api.post(`/user/${user_id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error fetching saved folders for user');
  }
};
