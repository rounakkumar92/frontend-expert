export interface Author {
  name: string;
  avatarUrl: string;
  role?: string;
  bio?: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  readTime: string;
  tags: string[];
  category: string;
  author: Author;
  content: string;
}
