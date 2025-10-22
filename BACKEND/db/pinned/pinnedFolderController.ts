import { query } from '../dbconnect';

// Add a pinned folder for a user, ensuring the user has fewer than 4 pinned folders
export const addPinnedFolder = async (user_id: string, folder_id: string) => {
  // Check how many pinned folders the user already has
  const countText = `SELECT COUNT(*) FROM pinned_folders WHERE user_id = $1`;
  const countValues = [user_id];
  const countResult = await query(countText, countValues);
  const pinnedCount = parseInt(countResult.rows[0].count, 10);

  // If the user already has 4 pinned folders, reject the request
  if (pinnedCount >= 4) {
    throw new Error('Each user can only have a maximum of four pinned folders');
  }

  // Insert the new pinned folder
  const insertText = `
    INSERT INTO pinned_folders (user_id, folder_id)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const insertValues = [user_id, folder_id];
  const result = await query(insertText, insertValues);
  return result.rows[0]; // Return the created pin
};

// Remove a pinned folder by user ID and folder ID
export const removePinnedFolder = async (user_id: string, folder_id: string) => {
  const text = `DELETE FROM pinned_folders WHERE user_id = $1 AND folder_id = $2 RETURNING *`;
  const values = [user_id, folder_id];
  const result = await query(text, values);
  return result.rows[0]; // Return the deleted pin (if any)
};

// Get all pinned folders for a user
export const getPinnedFoldersOfUser = async (user_id: string) => {
  const text = `SELECT * FROM pinned_folders WHERE user_id = $1`;
  const values = [user_id];
  const result = await query(text, values);
  return result.rows; // Return all pinned folders for the user
};
