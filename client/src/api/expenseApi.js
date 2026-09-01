import axios from 'axios';

// Base API instance (proxied to backend in vite.config.js)
const apiClient = axios.create({
  baseURL: '/api/expenses',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const expenseApi = {
  /**
   * Fetch expenses with optional query filters and AbortSignal
   */
  getExpenses: async (params = {}, signal = null) => {
    const response = await apiClient.get('/', {
      params,
      signal: signal || undefined,
    });
    return response.data;
  },

  /**
   * Fetch single expense
   */
  getExpenseById: async (id, signal = null) => {
    const response = await apiClient.get(`/${id}`, {
      signal: signal || undefined,
    });
    return response.data;
  },

  /**
   * Create new expense
   */
  createExpense: async (expenseData) => {
    const response = await apiClient.post('/', expenseData);
    return response.data;
  },

  /**
   * Update existing expense
   */
  updateExpense: async (id, expenseData) => {
    const response = await apiClient.put(`/${id}`, expenseData);
    return response.data;
  },

  /**
   * Delete expense by ID
   */
  deleteExpense: async (id) => {
    const response = await apiClient.delete(`/${id}`);
    return response.data;
  },

  /**
   * Fetch aggregated summary & chart analytics
   */
  getSummary: async (signal = null) => {
    const response = await apiClient.get('/summary', {
      signal: signal || undefined,
    });
    return response.data;
  },

  /**
   * Reset / Seed sample data
   */
  seedSampleExpenses: async () => {
    const response = await apiClient.post('/seed');
    return response.data;
  },
};

export default expenseApi;
