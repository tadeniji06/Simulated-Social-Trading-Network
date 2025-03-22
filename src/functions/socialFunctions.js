import authAxios from './authFunctions';

// Friend request functions
export const sendFriendRequest = async (userId) => {
  try {
    const response = await authAxios.post(`/social/friends/request/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error. Please try again.' };
  }
};

export const acceptFriendRequest = async (userId) => {
  try {
    const response = await authAxios.post(`/social/friends/accept/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error. Please try again.' };
  }
};

export const rejectFriendRequest = async (userId) => {
  try {
    const response = await authAxios.post(`/social/friends/reject/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error. Please try again.' };
  }
};

export const removeFriend = async (userId) => {
  try {
    const response = await authAxios.delete(`/social/friends/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error. Please try again.' };
  }
};

export const getFriends = async () => {
  try {
    const response = await authAxios.get('/social/friends');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error. Please try again.' };
  }
};

export const getFriendRequests = async () => {
  try {
    const response = await authAxios.get('/social/friends/requests');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error. Please try again.' };
  }
};

// Follow functions
export const followUser = async (userId) => {
  try {
    const response = await authAxios.post(`/social/follow/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error. Please try again.' };
  }
};

export const unfollowUser = async (userId) => {
  try {
    const response = await authAxios.delete(`/social/follow/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error. Please try again.' };
  }
};

export const getFollowers = async () => {
  try {
    const response = await authAxios.get('/social/followers');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error. Please try again.' };
  }
};

export const getFollowing = async () => {
  try {
    const response = await authAxios.get('/social/following');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error. Please try again.' };
  }
};

// Activity feed
export const getActivityFeed = async () => {
  try {
    const response = await authAxios.get('/social/feed');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error. Please try again.' };
  }
};

// Search users
export const searchUsers = async (query) => {
  try {
    const response = await authAxios.get(`/users/search?q=${query}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error. Please try again.' };
  }
};
