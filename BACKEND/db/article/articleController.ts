import { query } from '../dbconnect';

// Get an article by its ID
export const getArticleById = async (article_id: string) => {
  const text = `
    SELECT 
      a.*, 
      (
        SELECT row_to_json(am)
        FROM article_metadata am
        WHERE am.article_id = a.id
        LIMIT 1
      ) AS meta
    FROM 
      articles a
    WHERE 
      a.id = $1
  `;
  const values = [article_id];
  try {
    const result = await query(text, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};



export const getArticlesByIds = async (articleIds: string[]) => {
  if (articleIds.length === 0) return []; // Return empty array if no IDs provided

  const text = `SELECT * FROM articles WHERE id = ANY($1::uuid[])`; // Adjust the type as needed
  const values = [articleIds];
  const result = await query(text, values);

  return result.rows; // Return all found articles
};

// Get all views for a specific article by ID
export const getArticleViewsById = async (article_id: string) => {
    const text = `SELECT * FROM article_views WHERE article_id = $1`; // Query to fetch views for the given article_id
    const values = [article_id];
    const result = await query(text, values);
    
    // Return the number of views; if none found, return 0
    return result.rows.length; // Return all views if found, otherwise return 0
};

  
  // Add a new article view for a specific user and article
  export const addArticleView = async (user_id: string, article_id: string) => {
    const text = `
      INSERT INTO article_views (user_id, article_id)
      VALUES ($1, $2)
      RETURNING *
      ON CONFLICT DO NOTHING;
    `;
    const values = [user_id, article_id];
    const result = await query(text, values);
    return result.rows[0]; // Return the created article view
  };
