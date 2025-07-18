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
  description?: string;
  foundedYear?: number;
  country?: string;
  employeeCount?: number;
  isPublic: boolean;
  mainProducts?: string[];
  robotProjects?: string[];
  website?: string;
  sector?: CompanySector;
}

export interface StockPriceHistory {
  date: Date;
  price: number;
  volume?: number;
}

export type CompanySector = 
  | 'robotics'
  | 'automotive'
  | 'technology'
  | 'defense'
  | 'research'
  | 'consumer';

export type CompanySortOption = 
  | 'name'
  | 'marketCap'
  | 'changePercent'
  | 'country'
  | 'employeeCount';

export interface CompanyFilterOptions {
  sector?: CompanySector;
  country?: string;
  isPublic?: boolean;
  marketCapRange?: {
    min?: number;
    max?: number;
  };
  sortBy: CompanySortOption;
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

export interface Robot {
  id: string;
  name: string;
  manufacturer: string;
  imageUrl?: string;
  description: string;
  specifications: {
    height: string;
    weight: string;
    batteryLife?: string;
    speed?: string;
    payload?: string;
  };
  features: string[];
  developmentStatus: RobotStatus;
  category: RobotCategory;
  releaseYear?: number;
  price?: {
    amount: number;
    currency: string;
    availability: string;
  };
  applications: string[];
  technicalSpecs?: {
    sensors?: string[];
    actuators?: string[];
    connectivity?: string[];
    operatingSystem?: string;
  };
}

export type RobotStatus = 
  | 'concept'
  | 'prototype'
  | 'development'
  | 'testing'
  | 'production'
  | 'commercial'
  | 'discontinued';

export type RobotCategory = 
  | 'industrial'
  | 'domestic'
  | 'research'
  | 'military'
  | 'healthcare'
  | 'entertainment'
  | 'service';

export interface RobotFilterOptions {
  manufacturer?: string;
  category?: RobotCategory;
  status?: RobotStatus;
  priceRange?: {
    min?: number;
    max?: number;
  };
  features?: string[];
  sortBy: RobotSortOption;
}

export type RobotSortOption = 
  | 'name'
  | 'manufacturer'
  | 'releaseYear'
  | 'price'
  | 'height'
  | 'weight';