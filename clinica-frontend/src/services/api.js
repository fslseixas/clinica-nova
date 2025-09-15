import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // backend na porta 3000
});

// Intercepta e configura headers para todas as requests
api.interceptors.request.use((config) => {
  // Garante que Content-Type seja application/json para POST/PUT
  if (['post', 'put', 'patch'].includes(config.method.toLowerCase())) {
    config.headers['Content-Type'] = 'application/json';
  }
  
  // Adiciona token se existir
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  console.log('🔄 Request config:', config);
  return config;
});

// Intercepta respostas para tratar erros
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.status, error.response?.data);
    
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem("token");
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;