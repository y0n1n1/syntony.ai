// query embedding to topic embeddings
// query embedding to topic's synonym's embeddings

import { query } from "../../dbconnect";
import { getEmbedding } from "../embedding";
import { metaSearchCriteria } from "../search";


// FOR NOW JUST Embeddings
// return top 100

type TopicMapping = Record<string, string[]>;

const mapping: TopicMapping = {
  "Organizations": [
    "by_institutions"
  ],
  "Areas": [
    "taxonomy_areas", 
    "taxonomy_topics"
  ],
  "Topics": [
    "deep_learning_techniques_used", 
    "tasks_list_of_tasks", 
    "taxonomy_topics", 
    "taxonomy_learning_type", 
    "taxonomy_experiment_type"
  ],
  "Models": [
    "mod_known_models_used"
  ],
  "Datasets": [
    "data_datasets_used"
  ],
  "Applications": [
    "application_domain"
  ],
  "Metrics": [
    "mod_evaluation_metrics_for_models"
  ],
  "Datatype/Modality": [
    "data_type", 
    "modalities"
  ],
  "Algorithms": [
    "used_algorithms", 
    "deep_learning_techniques_used", 
    "tasks_list_of_tasks"
  ],
  "Tools": [
    "expdet_hardware", 
    "expdet_training_frameworks"
  ]
};

function getMappings(inputs: string[]): string[] {
    // Flatten and deduplicate the results
    return [...new Set(
      inputs.flatMap((input) => mapping[input] || []) // Flatten and filter
    )];
  }
  
  export async function searchTopicSolely(q:string):Promise<any[]>{
    const text = `SELECT *, 
      levenshtein(LPAD(LEFT(LOWER(topic), LENGTH($1)), LENGTH($1), ' '), LOWER($1)) AS distance,
      SOUNDEX(topic) AS soundex_val,
      similarity(LOWER(topic), LOWER($1)) AS trigram_similarity
    FROM meta_topics
    WHERE levenshtein(LPAD(LEFT(LOWER(topic), LENGTH($1)), LENGTH($1), ' '), LOWER($1)) <= 7
    ORDER BY distance ASC, soundex_val ASC, trigram_similarity DESC
    LIMIT 10;`;
  
    const value = [q];
    try {
      const result = await query(text, value);
      const topics = result.rows;
  
  
      return topics
    } catch (error) {
      console.error("Error querying database:", error);

      return []
    }
}
  


  export async function SearchTopics(criteriaList: metaSearchCriteria):Promise<any[]> {
    try {
        let result;
        if (criteriaList.include?.includes("All") || !criteriaList.include) {
            const query_emb = criteriaList.query_embedding
            const formatted_query_emb = `[${query_emb.join(', ')}]`;
            const text = `SELECT *,
                (topic_embedding <=> $1) AS score
                FROM meta_topics
                ORDER BY (topic_embedding <=> $1)
                LIMIT 200`;
            const vals = [formatted_query_emb];
            result = await query(text, vals);  // Awaiting query result
        } else if (criteriaList.include) {
            const mapped = getMappings(criteriaList.include);
            const query_emb = criteriaList.query_embedding
            const formatted_query_emb = `[${query_emb.join(', ')}]`;
            const text = `SELECT *,
                (topic_embedding <=> $1) AS score
                FROM meta_topics
                WHERE topic_type = ANY($2)
                ORDER BY (topic_embedding <=> $1)
                LIMIT 200`;
            const vals = [formatted_query_emb, mapped];
            result = await query(text, vals);  // Awaiting query result
        }
        console.log("TOPICS resulted")
        return result?.rows.map(row => ({
            item: row,
            result_type: "topic",
            score: row.score
        }))||[]
    } catch (error) {
        console.error("Error executing query:", error);
        return [];
    }
}