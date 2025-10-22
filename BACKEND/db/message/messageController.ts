import { query } from '../dbconnect';
import { v4 as uuidv4 } from 'uuid';

// Create a new message
export const createMessage = async (
  senderId: string,
  receiverId: string,
  content: string
) => {
  const text = `
    INSERT INTO messages (sender_id, receiver_id, timestamp, content)
    VALUES ($1, $2, CURRENT_TIMESTAMP, $3)
    RETURNING *;
  `;
  const values = [senderId, receiverId, content];
  const result = await query(text, values);
  return result.rows[0]; // Return the created message
};

// Update message content
export const updateMessage = async (
  messageId: string,
  content: string
) => {
  const text = `
    UPDATE messages 
    SET content = $2
    WHERE message_id = $1
    RETURNING *;
  `;
  const values = [messageId, content];
  const result = await query(text, values);
  console.log(result)
  return result.rows[0]; // Return the updated message
};

// Delete message by ID
export const deleteMessage = async (messageId: string) => {
  const text = `DELETE FROM messages WHERE message_id = $1 RETURNING *`;
  const values = [messageId];
  const result = await query(text, values);
  return result.rows[0]; // Return the deleted message (if any)
};

// Get all messages between two users
export const getMessagesBetweenUsers = async (userId1: string, userId2: string) => {
    console.log("MESSAGE REQ")
    console.log(userId1)
    console.log(userId2)
  const text = `
    SELECT * FROM messages 
    WHERE (sender_id = $1 AND receiver_id = $2) 
       OR (sender_id = $2 AND receiver_id = $1)
    ORDER BY timestamp ASC;
  `;
  const values = [userId1, userId2];
  const result = await query(text, values);
  console.log(result.rows)
  return result.rows; // Return all messages between the two users
};
