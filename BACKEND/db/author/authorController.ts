import { query } from '../dbconnect';

// Get article IDs by author ID
export const getArticlesIdsByAuthorId = async (author_id: string) => {
  const text = `
    SELECT article_id 
    FROM author_article 
    WHERE author_id = $1;
  `;
  const values = [author_id];
  const result = await query(text, values);
  return result.rows.map(row => row.article_id); // Return a list of article IDs
};

// Get author ID by author name (requires join with author table)
export const getAuthorIdByAuthorName = async (author_name: string) => {
  const text = `
    SELECT id 
    FROM author 
    WHERE name = $1;
  `;
  const values = [author_name];
  const result = await query(text, values);
  return result.rows[0]?.id || null; // Return the author ID if found, otherwise null
};

// Get author ID by author name (requires join with author table)
export const getAuthorNameByAuthorId = async (author_id: string) => {
  const text = `
    SELECT name 
    FROM author 
    WHERE id = $1;
  `;
  const values = [author_id];
  const result = await query(text, values);
  return result.rows[0]?.name || null; // Return the author ID if found, otherwise null
};

// Get author IDs by article ID
export const getAuthorIdsByArticleId = async (article_id: string) => {
  const text = `
    SELECT author_id 
    FROM author_article 
    WHERE article_id = $1;
  `;
  const values = [article_id];
  const result = await query(text, values);
  return result.rows.map(row => row.author_id); // Return a list of author IDs
};
