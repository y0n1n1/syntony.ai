import { Router, Request, Response } from 'express';
import {
  createMessage,
  updateMessage,
  deleteMessage,
  getMessagesBetweenUsers,
} from './messageController'; // Adjust path as needed

const router = Router();

// Route to create a new message
router.post('/create', async (req: Request, res: Response) => {
  try {
    const { sender_id, receiver_id, content } = req.body;
    const message = await createMessage(sender_id, receiver_id, content);
    console.log(message)
    res.status(201).json(message);

  } catch (error) {
    res.status(500).json({ error: 'Error creating message' });
  }
});


// Route to update a message
router.put('/update', async (req: Request, res: Response) => {
  try {
    const { message_id, content } = req.body;
    const updatedMessage = await updateMessage(message_id, content);
    if (updatedMessage) {
      res.status(200).json(updatedMessage);
    } else {
      res.status(404).json({ error: 'Message not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating message' });
  }
});

// Route to delete a message by ID
router.post('/delete', async (req: Request, res: Response) => {
  try {
    const deletedMessage = await deleteMessage(req.body.message_id);
    if (deletedMessage) {
      res.status(200).json({ message: 'Message deleted', messageId: deletedMessage });
    } else {
      res.status(404).json({ error: 'Message not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error deleting message' });
  }
});

// Route to get messages between two users
router.get('/between/:userId1/:userId2', async (req: Request, res: Response) => {
    try {
      const { userId1, userId2 } = req.params;

      const messages = await getMessagesBetweenUsers(userId1, userId2);
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching messages' });
    }
  });
  

export { router as messageRouter };
