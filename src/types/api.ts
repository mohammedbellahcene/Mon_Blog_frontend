export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Theme {
  id: number;
  name: string;
  description?: string;
  slug: string;
  thumbnail: string | null;
  isActive: boolean;
  postsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  author: {
    id: number;
    username: string;
    email: string;
  };
  theme: {
    id: number;
    name: string;
  };
  tags: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
  publishAt?: string;
  featuredImage?: string;
  featuredImageAlt?: string;
  featuredImageCaption?: string;
  viewCount?: number;
}

export interface Comment {
  id: number;
  content: string;
  author: {
    id: number;
    username: string;
  };
  createdAt: string;
  updatedAt: string;
  status?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

export interface PostCreateRequest {
  title: string;
  content: string;
  excerpt?: string;
  metaDescription?: string;
  slug?: string;
  featuredImage?: string;
  featuredImageAlt?: string;
  featuredImageCaption?: string;
  ogImage?: string;
  galleryImages?: string[];
  themeId: number;
  tags?: string[];
  status?: string;
  publishAt?: string;
}

export interface CommentCreateRequest {
  content: string;
}

export type PostStatus = 'DRAFT' | 'PUBLISHED' | 'SCHEDULED';

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
} 