import { query } from '../dbconnect';
import { addOneCountSavedFolder } from '../saved_folder/savedFolderController';

// Create a new saved article
export const createSavedarticle = async (folder_id: string, article_id: string, user_id:string) => {
  const text = `
    INSERT INTO saved_articles (folder_id, article_id, saved_at, user_id)
    VALUES ($1, $2, NOW(), $3)
    RETURNING *;
  `;
  const values = [folder_id, article_id, user_id];
  const result = await query(text, values);
  console.log(result)
  addOneCountSavedFolder(folder_id)
  return result.rows[0]; // Return the created saved article

};

// Read (Get) saved article information by ID
export const getFoldersByUserIdArticleId = async (article_id: string, user_id:string) => {
  const text = `SELECT * FROM saved_articles WHERE article_id = $1 AND user_id = $2`; // Updated to new naming convention
  const values = [article_id, user_id];
  const result = await query(text, values);
  return result.rows[0]; // Return the saved article if found
};

// Delete saved article by ID
export const deleteSavedarticle = async (article_id: string, folder_id:string) => {
  const text = `DELETE FROM saved_articles WHERE article_id = $1 AND folder_id = $2 RETURNING *`; // Updated to new naming convention
  const values = [article_id, folder_id];
  const result = await query(text, values);
  return result.rows[0]; // Return the deleted saved article (if any)
};

// Get all saved articles for a folder
export const getSavedarticlesByFolderId = async (folder_id: string) => {
  const text = `SELECT * FROM saved_articles WHERE folder_id = $1`; // Updated to new naming convention
  const values = [folder_id];
  const result = await query(text, values);
  const res = result.rows
  console.log(res)

  const articleIds = res.map(item => item.article_id);
  
  // Dynamically build placeholders for each article_id
  const placeholders = articleIds.map((_, index) => `$${index + 1}`).join(', ');

  // Query to get articles where article_id matches any in the list
  const text_2 = `SELECT * FROM articles WHERE id IN (${placeholders})`;
  const result_2 = await query(text_2, articleIds);
  console.log(result_2.rows)

  return result_2.rows; // Assuming result.rows contains the data you need
};