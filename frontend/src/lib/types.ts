export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  imageUrl?: string;
  author: string;
  source: string;
  publishedAt: Date;
  category: ArticleCategory;
  tags: string[];
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isBookmarked?: boolean;
}

export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  author: User;
  createdAt: Date;
  updatedAt: Date;
  category: CommunityCategory;
  tags: string[];
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isLiked?: boolean;
  isPinned: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  isVerified: boolean;
  joinedAt: Date;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: Date;
  likeCount: number;
  isLiked?: boolean;
  parentId?: string;
  replies?: Comment[];
}

export interface Company {
  id: string;
  name: string;
  symbol: string;
  currentPrice: number;
  changePercent: number;
  changeAmount: number;
  logoUrl?: string;
  marketCap?: number;
}

export type ArticleCategory = 
  | 'news'
  | 'tech-review'
  | 'company-update'
  | 'research'
  | 'innovation';

export type CommunityCategory =
  | 'general'
  | 'technical'
  | 'showcase'
  | 'question'
  | 'discussion';

export type SortOption = 'latest' | 'popular' | 'trending' | 'commented';

export interface FilterOptions {
  category?: ArticleCategory | CommunityCategory;
  tags?: string[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  sortBy: SortOption;
}

export interface NavItem {
  label: string;
  href: string;
  isActive?: boolean;
}