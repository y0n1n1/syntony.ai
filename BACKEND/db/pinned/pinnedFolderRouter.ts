import { Router, Request, Response } from 'express';
import {
  addPinnedFolder,
  removePinnedFolder,
  getPinnedFoldersOfUser
} from './pinnedFolderController';

const router = Router();

// Route to add a pinned folder
router.post('/add', async (req: Request, res: Response) => {
  try {
    const { user_id, folder_id } = req.body;
    const pinnedFolder = await addPinnedFolder(user_id, folder_id);
    res.status(201).json(pinnedFolder);
  } catch (error) {
    console.error('Error adding pinned folder:', error);

    if (error instanceof Error) {
      if (error.message === 'Each user can only have a maximum of four pinned folders') {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error adding pinned folder' });
      }
    } else {
      res.status(500).json({ error: 'Unknown error occurred' });
    }
  }
});

// Route to remove a pinned folder
router.delete('/remove', async (req: Request, res: Response) => {
  try {
    const { user_id, folder_id } = req.body;
    const removedPin = await removePinnedFolder(user_id, folder_id);
    if (removedPin) {
      res.status(200).json({ message: 'Pinned folder removed', user_id, folder_id });
    } else {
      res.status(404).json({ error: 'Pinned folder not found' });
    }
  } catch (error) {
    console.error('Error removing pinned folder:', error);
    res.status(500).json({ error: 'Error removing pinned folder' });
  }
});

// Route to get all pinned folders for a user
router.post('/user/:user_id', async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;
    const pinnedFolders = await getPinnedFoldersOfUser(user_id);
    res.status(200).json(pinnedFolders);
  } catch (error) {
    console.error('Error fetching pinned folders for user:', error);
    res.status(500).json({ error: 'Error fetching pinned folders for user' });
  }
});

export { router as pinnedFolderRouter };
