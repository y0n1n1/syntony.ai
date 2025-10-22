import axios from 'axios';

// Base URL configuration (adjust the baseURL based on your Express server URL)
const api = axios.create({
  baseURL: "https://api.syntony.ai/api/article", // Adjust this URL based on your backend configuration
  headers: {
    'Content-Type': 'application/json',
  },
});

// TypeScript types for responses
export interface Article {
    external_id?: string;      // Unique identifier from an external source
    source?: string;           // Source of the article (e.g., arXiv, journal)
    title: string;            // Title of the article
    authors: string[];        // Array of authors (assuming multiple authors)
    published_date: string;   // Publication date (consider using Date type if needed)
    pdf_url?: string;          // URL to the PDF of the article
    comments?: string;        // Comments about the article (optional)
    journal_ref?: string;     // Reference to the journal (optional)
    doi?: string;             // Digital Object Identifier (optional)
    abstract: string;         // Abstract of the article
    categories: string[];     // Array of categories the article belongs to
    scat?: string;            // Subject classification (optional)
    id: string;               // Unique identifier in the database
    citations?: number;        // Number of citations the article has received
    last_citation_check?: string; // Date of the last citation check (optional)
    meta?: {
      data_type?: string[];
      article_id?: string;
      modalities?: string[];
      novel_name?: string;
      novel_present?: boolean; 
      novel_category: string; 
      taxonomy_areas?: string[];
      by_institutions?: string[];
      expdet_hardware?: string[]; 
      taxonomy_topics?: string[];
      used_algorithms?: string[];
      code_availability?: boolean;
      data_dataset_size?: string;
      application_domain?:string[];
      data_datasets_used?: string[];
      data_synthetic_data?: boolean; 
      tasks_list_of_tasks?: string[]; 
      mod_new_architecture?: boolean;
      mod_known_models_used?: string[]; 
      mod_pretrained_models?:boolean[];
      taxonomy_learning_type?: string[]; 
      application_explanation?: string; 
      taxonomy_experiment_type?:string[]; 
      expdet_training_frameworks?: string[];
      research_focus_key_findings?: string;
      deep_learning_techniques_used?: string[];
      expdet_computational_resources?: string;
      research_focus_primary_objective?: string;
      application_real_world_deployment?: boolean;
      mod_evaluation_metrics_for_models?: string[];
  }
}

// 1. Get Article by ID (`GET /article/:article_id`)
export const getArticleById = async (article_id: string): Promise<Article> => {
  try {
    const response = await api.post(`single/${article_id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error fetching article');
  }
};

// 1. Get Articles by Ids
export const getArticlesByIds = async (article_ids: string[]): Promise<Article[]> => {
  try {
    const response = await api.post(`/articles-by-ids`, {"article_ids": article_ids});
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error fetching article');
  }
};

// 2. Get Article Views by Article ID (`GET /article/:article_id/views`)
export const getArticleViewsById = async (article_id: string): Promise<number> => {
  try {
    const response = await api.post(`single/${article_id}/views`);
    return response.data; // Assumed to return an array of ArticleView objects
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error fetching article views');
  }
};

export const addArticleView = async (article_id: string, user_id:string) => {
  try {
    const response = await api.post(`single/${article_id}/view/${user_id}`);
    return response.data; // Assumed to return the newly created ArticleView object
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error adding article view');
  }
};
