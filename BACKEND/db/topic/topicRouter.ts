import { Router, Request, Response } from 'express';
import {
    getArticlesAndTopicByTopicId,
  getTopicIdByTopicNameAndType,
  getTopicAndTypeByTopicId,
  getTopicIdsByArticleId,
  getTopicsListsByArticleIdList,
} from './topicController';

const router = Router();

// Route to get articles by topic ID
router.post('/articles-by-topic/:topic_id', async (req: Request, res: Response) => {
  try {
    const { topic_id } = req.params;
    const articles = await getArticlesAndTopicByTopicId(topic_id);
    res.status(200).json(articles);
  } catch (error) {
    console.error('Error fetching articles by topic ID:', error);
    res.status(500).json({ error: 'Error fetching articles by topic ID' });
  }
});

// Route to get topic ID by topic name and type
router.post('/topic-id-by-name-and-type', async (req: Request, res: Response) => {
  try {
    const { topic_name, topic_type } = req.body;
    const topicId = await getTopicIdByTopicNameAndType(topic_name, topic_type);
    if (topicId) {
      res.status(200).json({ topicId });
    } else {
      res.status(404).json({ error: 'Topic not found' });
    }
  } catch (error) {
    console.error('Error fetching topic ID by name and type:', error);
    res.status(500).json({ error: 'Error fetching topic ID by name and type' });
  }
});

// Route to get topic and type by topic ID
router.post('/topic-and-type-by-id/:topic_id', async (req: Request, res: Response) => {
  try {
    const { topic_id } = req.params;
    const topicData = await getTopicAndTypeByTopicId(topic_id);
    if (topicData) {
      res.status(200).json(topicData);
    } else {
      res.status(404).json({ error: 'Topic not found' });
    }
  } catch (error) {
    console.error('Error fetching topic and type by topic ID:', error);
    res.status(500).json({ error: 'Error fetching topic and type by topic ID' });
  }
});

// Route to get topic IDs by article ID
router.post('/topics-by-article/:article_id', async (req: Request, res: Response) => {
  try {
    const { article_id } = req.params;
    const topicIds = await getTopicIdsByArticleId(article_id);
    res.status(200).json(topicIds);
  } catch (error) {
    console.error('Error fetching topic IDs by article ID:', error);
    res.status(500).json({ error: 'Error fetching topic IDs by article ID' });
  }
});

// Route to get topic IDs by article ID
router.post('/entire-topics-by-articles/', async (req: Request, res: Response) => {
    try {
      const { article_ids } = req.body;
      const topicIds = await getTopicsListsByArticleIdList(article_ids);
      res.status(200).json(topicIds);
    } catch (error) {
      console.error('Error fetching topic IDs by article ID:', error);
      res.status(500).json({ error: 'Error fetching topic IDs by article ID' });
    }
  });
  
  export { router as topicRouter };



