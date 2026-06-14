import axios from 'axios';
import { StorageService } from './storageservice';

// URL base da API. Pode ser alterada para localhost/IP durante o desenvolvimento.
export const BASE_URL = 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para anexar o token de autenticação JWT automaticamente a cada requisição
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await StorageService.get<string>('streamhub_auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('[API] Erro ao recuperar token de autenticação para requisição:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
