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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

api.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.user?.accessToken) {
    config.headers.Authorization = `Bearer ${session.user.accessToken}`;
  }
  return config;
});

export const auth = {
  login: (data: { email: string; password: string }) =>
    api.post('/api/auth/login', data),
  register: (data: { username: string; email: string; password: string; confirmPassword: string }) =>
    api.post('/api/auth/register', data, {
      headers: { 'Content-Type': 'application/json' }
    }),
};

export const posts = {
  getAll: () => api.get('/api/posts/all'),
  getById: (id: string) => api.get(`/api/posts/${id}`),
  create: (data: any) => api.post('/api/posts', data),
  update: (id: number, data: any) => api.put(`/api/posts/${id}`, data),
  delete: (id: number) => api.delete(`/api/posts/${id}`),
};

export const comments = {
  getByPost: (postId: number) =>
    api.get<PaginatedResponse<Comment>>(`/api/posts/${postId}/comments`),
  create: (postId: number, data: CommentCreateRequest) =>
    api.post<Comment>(`/api/posts/${postId}/comments`, data),
  delete: (id: number) =>
    api.delete(`/api/comments/${id}`),
};

export const reactions = {
  add: (postId: number, type: 'LIKE' | 'DISLIKE') => 
    api.post(`/api/reactions/posts/${postId}`, { type }),
  delete: (postId: number) => 
    api.delete(`/api/reactions/posts/${postId}`),
  getUserReaction: (postId: number) => 
    api.get(`/api/reactions/posts/${postId}/user`),
};

export const themes = {
  getAll: () =>
    api.get<Theme[]>('/api/themes'),
  getById: (id: number) =>
    api.get<Theme>(`/api/themes/${id}`),
};

export async function deletePost(id: string) {
  const response = await api.delete(`/api/posts/${id}`);
  if (response.status !== 200 && response.status !== 204) {
    throw new Error('Failed to delete post');
  }
} 

export { api }; 