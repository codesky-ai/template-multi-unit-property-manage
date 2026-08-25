import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'Accept-Language': 'ar',
    'Accept': 'application/json'
  }
});

// إضافة interceptor للطلبات
apiClient.interceptors.request.use(
  (config) => {
    console.log(`طلب API: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('خطأ في طلب API:', error);
    return Promise.reject(error);
  }
);

// إضافة interceptor للاستجابات
apiClient.interceptors.response.use(
  (response) => {
    console.log(`استجابة API: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('خطأ في استجابة API:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

export default apiClient;