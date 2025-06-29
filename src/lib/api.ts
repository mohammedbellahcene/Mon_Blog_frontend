import axios from 'axios';
import { getSession } from 'next-auth/react';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  Post,
  PostCreateRequest,
  Comment,
  CommentCreateRequest,
  PaginatedResponse,
  Theme,
} from '@/types/api';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

api.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});

export const auth = {
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  register: (data: { username: string; email: string; password: string }) =>
    api.post('/auth/register', data),
};

export const posts = {
  getAll: () => api.get('/posts/all'),
  getById: (id: string) => api.get(`/posts/${id}`),
  create: (data: any) => api.post('/posts', data),
  update: (id: number, data: any) => api.put(`/posts/${id}`, data),
  delete: (id: number) => api.delete(`/posts/${id}`),
};

export const comments = {
  getByPost: (postId: number) =>
    api.get<PaginatedResponse<Comment>>(`/posts/${postId}/comments`),
  create: (postId: number, data: CommentCreateRequest) =>
    api.post<Comment>(`/posts/${postId}/comments`, data),
  delete: (id: number) =>
    api.delete(`/comments/${id}`),
};

export const themes = {
  getAll: () =>
    api.get<Theme[]>('/themes'),
  getById: (id: number) =>
    api.get<Theme>(`/themes/${id}`),
}; 