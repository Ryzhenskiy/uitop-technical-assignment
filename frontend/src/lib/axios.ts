import axios from 'axios';

console.log({
  url: import.meta.env.VITE_API_URL,
});

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
