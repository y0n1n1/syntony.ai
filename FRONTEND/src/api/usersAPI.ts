import axios from 'axios';


// Base URL configuration (adjust the baseURL based on your Express server URL)
const api = axios.create({
  baseURL: "https://api.syntony.ai/api/", // Adjust this URL based on your backend configuration
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. Create a New User (POST /users)
interface CreateUserRequest {
  name: string;
  occupation: string;
  organization: string;
  country: string;
  username: string;
  email: string;
  password: string;
}

export const createUser = async (data: CreateUserRequest) => {
  try {
    const response = await api.post('/users', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error creating user');
  }
};

// 2. Get User by ID (GET /users/:id)
export const getUserById = async (id: string) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error fetching user');
  }
};

// 3. Update User (PUT /users/:id)
interface UpdateUserRequest {
  name?: string;
  occupation?: string;
  organization?: string;
  country?: string;
  username?: string;
  email?: string;
  password?: string;
}

export const updateUser = async (id: string, data: UpdateUserRequest) => {
  try {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error updating user');
  }
};

interface Delete {
  id: string;
}

// 4. Delete User by ID 
export const deleteUser = async (id: Delete) => {
  try {
    console.log(id)
    const response = await api.post('/users/delete', id);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error deleting user');
  }
};

// 5. Sign-up User (POST /users/signup)
interface SignUpRequest {
  name: string;
  occupation: string;
  organization: string;
  country: string;
  username: string;
  email: string;
  password: string;
}

export const signUpUser = async (data: SignUpRequest) => {
  try {
    const response = await api.post('/users/signup', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error signing up user');
  }
};

// 6. Sign-in User (POST /users/signin)
interface SignInRequest {
  identifier: string; // Could be email or username
  password: string;
}

export const signInUser = async (data: SignInRequest) => {
  try {
    const response = await api.post('/users/signin', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error signing in user');
  }
};

// 7. Refresh Access Token (POST /users/refresh)
export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const response = await api.post('/users/refresh', { refreshToken });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error refreshing access token');
  }
};

// 8. Logout User (POST /users/logout)
export const logoutUser = async (refreshToken: string) => {
  try {
    const response = await api.post('/users/logout', { refreshToken });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error logging out user');
  }
};

