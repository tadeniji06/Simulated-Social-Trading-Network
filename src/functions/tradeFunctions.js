import authAxios from './authFunctions';
// import { API_URL } from '../utils/api';

// Execute a market trade
export const executeMarketTrade = async (coinId, coinSymbol, type, quantity) => {
  try {
    const response = await authAxios.post(`/trade/market`, {
      coinId,
      coinSymbol,
      type,
      quantity
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error. Please try again.' };
  }
};

// Place a limit or stop order
export const placeOrder = async (coinId, coinSymbol, type, quantity, orderType, limitPrice, stopPrice) => {
  try {
    const response = await authAxios.post(`/trade/order`, {
      coinId,
      coinSymbol,
      type,
      quantity,
      orderType,
      limitPrice,
      stopPrice
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error. Please try again.' };
  }
};

// Get user's active orders
export const getOrders = async () => {
  try {
    const response = await authAxios.get(`/trade/orders`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error. Please try again.' };
  }
};

// Cancel an order
export const cancelOrder = async (orderId) => {
  try {
    const response = await authAxios.delete(`/trade/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error. Please try again.' };
  }
};

// Get user's portfolio
export const getPortfolio = async () => {
  try {
    const response = await authAxios.get(`/trade/portfolio`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error. Please try again.' };
  }
};

// Get user's trade history
export const getTradeHistory = async () => {
  try {
    const response = await authAxios.get(`/trade/history`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error. Please try again.' };
  }
};

// Get market data
export const getMarketData = async (page = 1, limit = 50) => {
  try {
    const response = await authAxios.get(`/trade/market?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error. Please try again.' };
  }
};

// Get coin details
export const getCoinDetails = async (coinId) => {
  try {
    const response = await authAxios.get(`/trade/coins/${coinId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error. Please try again.' };
  }
};

// Search coins
export const searchCoins = async (query) => {
  try {
    const response = await authAxios.get(`/trade/search?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error. Please try again.' };
  }
};


// Close a position (fully or partially)
export const closePosition = async (coinId, percentage = 100) => {
  try {
    const response = await authAxios.post('/trade/close-position', { 
      coinId, 
      percentage 
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error. Please try again.' };
  }
};