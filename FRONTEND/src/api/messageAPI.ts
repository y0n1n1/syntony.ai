import axios from 'axios';

// Base URL configuration (adjust the baseURL based on your Express server URL)
const api = axios.create({
  baseURL: "https://api.syntony.ai/api/messages", // Adjust this URL based on your backend configuration
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. Create a New Message (`POST /messages/create`)
interface CreateMessageRequest {
  sender_id: string;
  receiver_id: string;
  content: string;
}

export const createMessage = async (data: CreateMessageRequest) => {
  try {
    const response = await api.post('/create', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error creating message');
  }
};

// 2. Update a Message (`PUT /messages/update`)
interface UpdateMessageRequest {
  message_id: string;
  content: string;
}

export const updateMessage = async (data: UpdateMessageRequest) => {
  try {
    const response = await api.put('/update', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error updating message');
  }
};

// 3. Delete a Message by ID (`POST /messages/delete`)
interface DeleteMessageRequest {
  message_id: string;
}

export const deleteMessage = async (data: DeleteMessageRequest) => {
  try {
    const response = await api.post('/delete', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error deleting message');
  }
};

// 4. Get Messages Between Two Users (`GET /messages/between/:userId1/:userId2`)
export const getMessagesBetweenUsers = async (userId1: string, userId2: string) => {
  try {
    const response = await api.get(`/between/${userId1}/${userId2}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error fetching messages between users');
  }
};
