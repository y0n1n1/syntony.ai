import axios from 'axios';

// Base URL configuration (adjust the baseURL based on your Express server URL)
const api = axios.create({
  baseURL: "https://api.syntony.ai/api/topic", // Adjust this URL based on your backend configuration
  headers: {
    'Content-Type': 'application/json',
  },
});

// Get Articles by Topic ID (`POST /articles-by-topic/:topic_id`)
export const getArticlesByTopicId = async (topic_id: string) => {
  try {
    const response = await api.post(`/articles-by-topic/${topic_id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error fetching articles by topic ID');
  }
};

// Get Topic ID by Topic Name and Type (`POST /topic-id-by-name-and-type`)
export const getTopicIdByNameAndType = async (topic_name: string, topic_type: string) => {
  try {
    const response = await api.post(`/topic-id-by-name-and-type`, { topic_name, topic_type });
    return response.data.topicId;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error fetching topic ID by name and type');
  }
};

// Get Topic and Type by Topic ID (`POST /topic-and-type-by-id/:topic_id`)
export const getTopicAndTypeByTopicId = async (topic_id: string) => {
  try {
    const response = await api.post(`/topic-and-type-by-id/${topic_id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error fetching topic and type by topic ID');
  }
};

// Get Topic IDs by Article ID (`POST /topics-by-article/:article_id`)
export const getTopicIdsByArticleId = async (article_id: string) => {
  try {
    const response = await api.post(`/topics-by-article/${article_id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error fetching topic IDs by article ID');
  }
};



// Get Topic IDs by Article ID (`POST /topics-by-article/:article_id`)
export const getTopicsListsByArticleIdList = async (article_ids: string[]) => {
    try {
      const response = await api.post(`/entire-topics-by-articles/`, { article_ids });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Error fetching topic IDs by article ID');
    }
  };
