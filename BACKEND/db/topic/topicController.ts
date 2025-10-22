import { query } from '../dbconnect';

export const getArticlesAndTopicByTopicId = async (topic_id: string) => {
    try {
        // Fetch topic metadata
        const topicQuery = `
        SELECT topic, topic_type
        FROM meta_topics
        WHERE id = $1
        `;
        const topicResult = await query(topicQuery, [topic_id]);
        const topicMetadata = topicResult.rows[0];

        if (!topicMetadata) {
        throw new Error('Topic not found');
        }

        // Fetch articles
        const articlesQuery = `
        SELECT a.*
        FROM articles a
        JOIN topic_article_connection tac ON a.id = tac.article_id
        WHERE tac.topic_id = $1
        `;
        const articlesResult = await query(articlesQuery, [topic_id]);

        // Combine results
        return {
        topic: topicMetadata,
        articles: articlesResult.rows,
        };
    } catch (error) {
        console.error('Error fetching articles by topic ID:', error);
        throw error;
    }
};

      
  
// Get topic ID by topic and type 
export const getTopicIdByTopicNameAndType = async (topic_name: string, topic_type:string) => {
  const text = `
    SELECT id 
    FROM meta_topics 
    WHERE topic = $1 and topic_type = $2;
  `;
  const values = [topic_name, topic_type];
  const result = await query(text, values);
  return result.rows[0]?.id || null; // Return the topic ID if found, otherwise null
};

// Get topic ID by topic and type 
export const getTopicAndTypeByTopicId = async (topic_id: string) => {
  const text = `
    SELECT topic, topic_type 
    FROM meta_topics 
    WHERE id = $1;
  `;
  const values = [topic_id];
  const result = await query(text, values);
  return result.rows[0] || null; 
};

// Get topic IDs by article ID
export const getTopicIdsByArticleId = async (article_id: string) => {
  const text = `
    SELECT topic_id 
    FROM topic_article_connection 
    WHERE article_id = $1;
  `;
  const values = [article_id];
  const result = await query(text, values);
  return result.rows.map(row => row.author_id); // Return a list of topic IDs
};


export const getTopicsListsByArticleIdList = async (article_ids: string[]) => {
    // SQL query to fetch the meta_topic rows for all article_ids at once
    const text = `
      SELECT tac.article_id, mt.*
      FROM topic_article_connection tac
      JOIN meta_topics mt ON mt.id = tac.topic_id
      WHERE tac.article_id = ANY($1);
    `;
    
    // Pass the list of article_ids as a parameter
    const values = [article_ids];
    
    // Execute the query
    const result = await query(text, values);

    // Initialize an empty result object to store the mappings of article_id to meta_topic rows
    const resultMap: Record<string, any[]> = {};

    // Iterate through the result rows and organize them into the resultMap
    result.rows.forEach(row => {
        // If the article_id isn't in the resultMap, initialize it with an empty array
        if (!resultMap[row.article_id]) {
            resultMap[row.article_id] = [];
        }
        
        // Push the current meta_topic row into the list for the corresponding article_id
        resultMap[row.article_id].push(row);
    });

    // Return the dictionary that maps article_id to the list of meta_topic rows
    return resultMap;
};
