import { Router, Request, Response } from 'express';
import {
  getArticlesIdsByAuthorId,
  getAuthorIdByAuthorName,
  getAuthorIdsByArticleId,
  getAuthorNameByAuthorId
} from './authorController';

const router = Router();

// Route to get article IDs by author ID
router.post('/articles-by-author/:author_id', async (req: Request, res: Response) => {
  try {
    const { author_id } = req.params;
    const articleIds = await getArticlesIdsByAuthorId(author_id);
    res.status(200).json(articleIds);
  } catch (error) {
    console.error('Error fetching article IDs by author ID:', error);
    res.status(500).json({ error: 'Error fetching article IDs by author ID' });
  }
});

// Route to get author ID by author name
router.post('/author-id-by-name/:author_name', async (req: Request, res: Response) => {
  try {
    const { author_name } = req.params;
    const authorId = await getAuthorIdByAuthorName(author_name);
    if (authorId) {
      res.status(200).json({ authorId });
    } else {
      res.status(404).json({ error: 'Author not found' });
    }
  } catch (error) {
    console.error('Error fetching author ID by name:', error);
    res.status(500).json({ error: 'Error fetching author ID by name' });
  }
});

// Route to get author ID by author name
router.post('/author-name-by-id/:author_id', async (req: Request, res: Response) => {
  try {
    const { author_id } = req.params;
    const authorName = await getAuthorNameByAuthorId(author_id);
    if (authorName) {
      res.status(200).json(authorName);
    } else {
      res.status(404).json({ error: 'Author not found' });
    }
  } catch (error) {
    console.error('Error fetching author ID by name:', error);
    res.status(500).json({ error: 'Error fetching author ID by name' });
  }
});

// Route to get author IDs by article ID
router.post('/authors-by-article/:article_id', async (req: Request, res: Response) => {
  try {
    const { article_id } = req.params;
    const authorIds = await getAuthorIdsByArticleId(article_id);
    res.status(200).json(authorIds);
  } catch (error) {
    console.error('Error fetching author IDs by article ID:', error);
    res.status(500).json({ error: 'Error fetching author IDs by article ID' });
  }
});

export { router as authorRouter };
