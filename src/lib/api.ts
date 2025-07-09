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
  baseURL: `${API_URL}/api`,
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

export const reactions = {
  add: (postId: number, type: 'LIKE' | 'DISLIKE') => 
    api.post(`/reactions/posts/${postId}`, { type }),
  delete: (postId: number) => 
    api.delete(`/reactions/posts/${postId}`),
  getUserReaction: (postId: number) => 
    api.get(`/reactions/posts/${postId}/user`),
};

export const themes = {
  getAll: () =>
    api.get<Theme[]>('/themes'),
  getById: (id: number) =>
    api.get<Theme>(`/themes/${id}`),
};

export async function deletePost(id: string) {
  const response = await api.delete(`/posts/${id}`);
  if (response.status !== 200 && response.status !== 204) {
    throw new Error('Failed to delete post');
  }
} 