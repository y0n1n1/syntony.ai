import { Router, Request, Response } from 'express';
import {
  createSavedFolder,
  getSavedFolderById,
  updateSavedFolder,
  deleteSavedFolder,
  getSavedFoldersByUserId
} from './savedFolderController'; // Adjust path as needed

const router = Router();

// Route to create a new saved folder
router.post('/create', async (req: Request, res: Response) => {
  try {
    const { user_id, folder_name, description, is_public } = req.body; // Updated to new naming convention
    console.log(req.body)
    const folder = await createSavedFolder(user_id, folder_name, description, is_public); // Pass the description and is_public as needed
    res.status(201).json(folder);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error creating saved folder' });
  }
});

// Route to get a saved folder by ID
router.get('/:folder_id', async (req: Request, res: Response) => {
  try {
    const { folder_id } = req.params; // Updated to new naming convention
    const folder = await getSavedFolderById(folder_id);
    if (folder) {
      res.status(200).json(folder);
    } else {
      res.status(404).json({ error: 'Folder not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching saved folder' });
  }
});

// Route to update a saved folder
router.put('/update', async (req: Request, res: Response) => {
  try {
    const { folder_id, folder_name, description, is_public } = req.body; // Updated to new naming convention
    const updatedFolder = await updateSavedFolder(folder_id, folder_name, description, is_public);
    if (updatedFolder) {
      res.status(200).json(updatedFolder);
    } else {
      res.status(404).json({ error: 'Folder not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating saved folder' });
  }
});

// Route to delete a saved folder by ID
router.post('/delete', async (req: Request, res: Response) => {
  try {
    const deletedFolder = await deleteSavedFolder(req.body.folder_id); // Updated to new naming convention
    if (deletedFolder) {
      res.status(200).json({ message: 'Saved folder deleted', folder_id: req.body.folder_id });
    } else {
      res.status(404).json({ error: 'Folder not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error deleting saved folder' });
  }
});

// Route to get all saved folders for a user
router.post('/user/:user_id', async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params; // Updated to new naming convention
    const folders = await getSavedFoldersByUserId(user_id);
    res.status(200).json(folders);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching saved folders' });
  }
});

export { router as savedFolderRouter };
