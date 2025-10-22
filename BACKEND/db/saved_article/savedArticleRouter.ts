import { Router, Request, Response } from 'express';
import {
  createSavedarticle,
  getFoldersByUserIdArticleId,
  deleteSavedarticle,
  getSavedarticlesByFolderId
} from './savedArticleController'; // Adjust the path as needed to match your structure

const router = Router();

// Route to add a new saved article
router.post('/add', async (req: Request, res: Response) => {
  try {
    const { folder_id, article_id, user_id } = req.body;
    const savedArticle = await createSavedarticle(folder_id, article_id, user_id);
    res.status(201).json(savedArticle);
  } catch (error) {
    console.error('Error adding saved article:', error);
    res.status(500).json({ error: 'Error adding saved article' });
  }
});

// Route to get folders by article ID
router.post('/article/:article_id/user/:user_id', async (req: Request, res: Response) => {
  try {
    const { article_id, user_id } = req.params;
    const folders = await getFoldersByUserIdArticleId(article_id, user_id);
    if (folders) {
      res.status(200).json(folders);
    } else {
      res.status(404).json({ error: 'No folders found for this article' });
    }
  } catch (error) {
    console.error('Error fetching folders by article ID:', error);
    res.status(500).json({ error: 'Error fetching folders by article ID' });
  }
});

// Route to delete a saved article by article and folder ID
router.delete('/delete', async (req: Request, res: Response) => {
  try {
    const { article_id, folder_id } = req.body;
    const deletedArticle = await deleteSavedarticle(article_id, folder_id);
    if (deletedArticle) {
      res.status(200).json({ message: 'Saved article deleted', article_id, folder_id });
    } else {
      res.status(404).json({ error: 'Saved article not found' });
    }
  } catch (error) {
    console.error('Error deleting saved article:', error);
    res.status(500).json({ error: 'Error deleting saved article' });
  }
});

// Route to get all saved articles for a folder by folder ID
router.post('/folder/:folder_id', async (req: Request, res: Response) => {
  try {
    const { folder_id } = req.params;
    const savedArticles = await getSavedarticlesByFolderId(folder_id);
    res.status(200).json(savedArticles);
  } catch (error) {
    console.error('Error fetching saved articles by folder ID:', error);
    res.status(500).json({ error: 'Error fetching saved articles by folder ID' });
  }
});

export { router as savedArticleRouter };
