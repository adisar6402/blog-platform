export interface User {
  _id?: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
}

export interface BlogPost {
  _id?: string;
  title: string;
  content: string;
  slug: string;
  tags: string[];
  readingTime: number;
  createdAt: Date;
  updatedAt: Date;
  author: string;
  views: number;
}

export interface Analytics {
  postId: string;
  ip: string;
  timestamp: Date;
  userAgent?: string;
}

export interface ViewCount {
  total: number;
  daily: { [date: string]: number };
}

export interface RateLimit {
  count: number;
  resetTime: number;
}