import axios from 'axios';

// Create a central axios instance
// This automatically uses the environment variable if deployed to Vercel
// Or falls back to localhost:5000 for local development
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export default api;
