import { Router, Request, Response } from 'express';
import {
  getArticleById,
  getArticleViewsById,
  addArticleView,
  getArticlesByIds
} from './articleController'; // Adjust the path as needed to match your structure

const router = Router();

// Route to get an article by its ID
router.post('/single/:article_id', async (req: Request, res: Response) => {
  try {
    const { article_id } = req.params;
    const article = await getArticleById(article_id);
    if (article) {
      res.status(200).json(article);
    } else {
      res.status(404).json({ error: 'Article not found' });
    }
  } catch (error) {
    console.error('Error fetching article by ID:', error);
    res.status(500).json({ error: 'Error fetching article' });
  }
});
// Route to get an article by its ID
router.post('/articles-by-ids/', async (req: Request, res: Response) => {
  try {
    const { article_ids } = req.body;
    const article = await getArticlesByIds(article_ids);
    if (article) {
      res.status(200).json(article);
    } else {
      res.status(404).json({ error: 'Article not found' });
    }
  } catch (error) {
    console.error('Error fetching article by ID:', error);
    res.status(500).json({ error: 'Error fetching article' });
  }
});

// Route to get all views for a specific article by ID
router.post('/single/:article_id/views', async (req: Request, res: Response) => {
  try {
    const { article_id } = req.params;
    const views = await getArticleViewsById(article_id);
    res.status(200).json(views); // Return all views for the specified article
  } catch (error) {
    console.error('Error fetching views for article:', error);
    res.status(500).json({ error: 'Error fetching views for article' });
  }
});

// Route to add a new article view for a specific user and article
router.post('/single/:article_id/view/:user_id', async (req: Request, res: Response) => {
  try {
    const { article_id, user_id } = req.params;
    const newView = await addArticleView(user_id, article_id);
    res.status(201).json(newView); // Return the newly created article view
  } catch (error) {
    console.error('Error adding article view:', error);
    res.status(500).json({ error: 'Error adding article view' });
  }
});

export { router as articleRouter };
