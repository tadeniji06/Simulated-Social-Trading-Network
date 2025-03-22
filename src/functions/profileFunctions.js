import authAxios from './authFunctions';

// Get user profile (current user)
export const getUserProfile = async () => {
  try {
    const response = await authAxios.get('/user/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch profile data' };
  }
};

// Get user profile by ID (other users)
export const getUserProfileById = async (userId) => {
  try {
    const response = await authAxios.get(`/user/profile/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch user profile' };
  }
};

// Update user profile
export const updateUserProfile = async (profileData) => {
  try {
    const response = await authAxios.put('/user/profile', profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update profile' };
  }
};

// Get social status with another user
export const getSocialStatus = async (userId) => {
  try {
    const response = await authAxios.get(`/user/${userId}/social-status`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get social status' };
  }
};

// Get user's trades
export const getUserTrades = async (userId) => {
  try {
    const response = await authAxios.get(`/user/${userId}/trades`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch user trades' };
  }
};
