import { query } from '../dbconnect';

// Create a new saved folder
export const createSavedFolder = async (user_id: string, folder_name: string, description?: string, is_public?: boolean) => {
  const text = `
    INSERT INTO saved_folders (user_id, folder_name, description, is_public, created_at, article_count)
    VALUES ($1, $2, $3, $4, NOW(), 0)
    RETURNING *;
  `;
  const values = [user_id, folder_name, description, is_public];
  const result = await query(text, values);
  return result.rows[0]; // Return the created saved folder
};

// Read (Get) saved folder information by ID
export const getSavedFolderById = async (folder_id: string) => {
  const text = `SELECT * FROM saved_folders WHERE folder_id = $1`; // Updated to new naming convention
  const values = [folder_id];
  const result = await query(text, values);
  return result.rows[0]; // Return the saved folder if found
};

// Update saved folder information
export const updateSavedFolder = async (folder_id: string, folder_name?: string, description?: string, is_public?: boolean, article_count?:number) => {
  const text = `
    UPDATE saved_folders 
    SET 
      folder_name = COALESCE($2, folder_name), 
      description = COALESCE($3, description), 
      is_public = COALESCE($4, is_public),
      updated_at = NOW(),
      article_count = COALESCE($5, article_count)
    WHERE folder_id = $1
    RETURNING *;
  `;
  const values = [folder_id, folder_name, description, is_public, article_count];
  const result = await query(text, values);
  return result.rows[0]; // Return the updated saved folder
};

export const addOneCountSavedFolder = async (folder_id: string) => {
  const text = `
    UPDATE saved_folders 
    SET 
      article_count = article_count + 1
    WHERE folder_id = $1
    RETURNING *;
  `;
  const values = [folder_id];
  const result = await query(text, values);
  return result.rows[0]; // Return the updated saved folder
};



// Delete saved folder by ID
export const deleteSavedFolder = async (folder_id: string) => {
  const text = `DELETE FROM saved_folders WHERE folder_id = $1 RETURNING *`; // Updated to new naming convention
  const values = [folder_id];
  const result = await query(text, values);
  console.log("Deleted saved folder");
  return result.rows[0]; // Return the deleted saved folder (if any)
};

// Get all saved folders for a user
export const getSavedFoldersByUserId = async (user_id: string) => {
  const text = `SELECT * FROM saved_folders WHERE user_id = $1`; // Updated to new naming convention
  const values = [user_id];
  const result = await query(text, values);
  return result.rows; // Return all saved folders for the user
};
