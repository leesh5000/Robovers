'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Company, CommunityPost } from '@/lib/types';

interface SidebarProps {
  className?: string;
}

// 목 데이터
const mockCompanies: Company[] = [
  {
    id: '1',
    name: '테슬라',
    symbol: 'TSLA',
    currentPrice: 248.50,
    changePercent: 2.3,
    changeAmount: 5.58,
    logoUrl: '🚗',
    marketCap: 789000000000,
    isPublic: true
  },
  {
    id: '2',
    name: '보스턴 다이나믹스',
    symbol: 'HYUNDAI',
    currentPrice: 45.20,
    changePercent: -1.2,
    changeAmount: -0.55,
    logoUrl: '🤖',
    marketCap: 15000000000,
    isPublic: true
  },
  {
    id: '3',
    name: 'NVIDIA',
    symbol: 'NVDA',
    currentPrice: 875.30,
    changePercent: 4.1,
    changeAmount: 34.50,
    logoUrl: '💻',
    marketCap: 2100000000000,
    isPublic: true
  },
  {
    id: '4',
    name: 'Figure AI',
    symbol: 'PRIVATE',
    currentPrice: 0,
    changePercent: 0,
    changeAmount: 0,
    logoUrl: '🦾',
    marketCap: 2700000000,
    isPublic: false
  }
];

const mockRecentPosts: CommunityPost[] = [
  {
    id: '1',
    title: '옵티머스 로봇 실제로 봤는데...',
    content: '',
    author: {
      id: '1',
      username: '로봇매니아',
      email: '',
      isVerified: true,
      joinedAt: new Date()
    },
    createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30분 전
    updatedAt: new Date(),
    category: 'showcase',
    tags: ['테슬라', '옵티머스'],
    viewCount: 245,
    likeCount: 12,
    commentCount: 8,
    isPinned: false
  },
  {
    id: '2',
    title: '휴머노이드 로봇 구매 고민 중',
    content: '',
    author: {
      id: '2',
      username: 'TechNewbie',
      email: '',
      isVerified: false,
      joinedAt: new Date()
    },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2시간 전
    updatedAt: new Date(),
    category: 'question',
    tags: ['구매문의', '추천'],
    viewCount: 89,
    likeCount: 5,
    commentCount: 15,
    isPinned: false
  },
  {
    id: '3',
    title: '로봇공학 전공하는 게 어떨까요?',
    content: '',
    author: {
      id: '3',
      username: '미래학생',
      email: '',
      isVerified: false,
      joinedAt: new Date()
    },
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5시간 전
    updatedAt: new Date(),
    category: 'discussion',
    tags: ['진로', '교육'],
    viewCount: 156,
    likeCount: 23,
    commentCount: 31,
    isPinned: false
  }
];

const popularTags = [
  { name: '휴머노이드', count: 1250 },
  { name: '테슬라', count: 890 },
  { name: '보스턴다이나믹스', count: 567 },
  { name: 'AI', count: 445 },
  { name: '자동화', count: 334 },
  { name: '로봇공학', count: 298 },
  { name: '미래기술', count: 256 },
  { name: '혁신', count: 189 }
];

export default function Sidebar({ className = '' }: SidebarProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1000000000000) {
      return `${(marketCap / 1000000000000).toFixed(1)}T`;
    } else if (marketCap >= 1000000000) {
      return `${(marketCap / 1000000000).toFixed(1)}B`;
    } else if (marketCap >= 1000000) {
      return `${(marketCap / 1000000).toFixed(1)}M`;
    }
    return marketCap.toString();
  };

  const formatTimeAgo = (date: Date) => {
    // Date 객체가 아닌 경우 안전하게 변환
    const safeDate = date instanceof Date ? date : new Date(date);
    const now = new Date();
    const diffInMs = now.getTime() - safeDate.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);

    if (diffInMinutes < 60) {
      return `${diffInMinutes}분 전`;
    } else if (diffInHours < 24) {
      return `${diffInHours}시간 전`;
    } else {
      return safeDate.toLocaleDateString('ko-KR');
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <aside className={`space-y-6 ${className}`}>
      {/* 인기 태그 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">🔥 인기 태그</h3>
        </div>
        <div className="p-4">
          <div className="flex flex-wrap gap-2">
            {popularTags.slice(0, 8).map((tag) => (
              <Link
                key={tag.name}
                href={`/search?tag=${encodeURIComponent(tag.name)}`}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
              >
                #{tag.name}
                <span className="ml-1 text-blue-500">{tag.count}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 로봇 관련 기업 주가 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">📈 로봇 기업 주가</h3>
            <button
              onClick={() => toggleSection('stocks')}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className={`h-4 w-4 transform transition-transform ${
                  expandedSection === 'stocks' ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            {mockCompanies.slice(0, expandedSection === 'stocks' ? mockCompanies.length : 3).map((company) => (
              <div key={company.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{company.logoUrl}</span>
                  <div>
                    <div className="font-medium text-sm text-gray-900">{company.name}</div>
                    <div className="text-xs text-gray-500">{company.symbol}</div>
                  </div>
                </div>
                <div className="text-right">
                  {company.symbol !== 'PRIVATE' ? (
                    <>
                      <div className="font-medium text-sm text-gray-900">
                        ${company.currentPrice.toFixed(2)}
                      </div>
                      <div className={`text-xs font-medium ${
                        company.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {company.changePercent >= 0 ? '+' : ''}{company.changePercent.toFixed(1)}%
                      </div>
                    </>
                  ) : (
                    <div className="text-xs text-gray-500">비상장</div>
                  )}
                </div>
              </div>
            ))}
          </div>
          {!expandedSection && mockCompanies.length > 3 && (
            <button
              onClick={() => toggleSection('stocks')}
              className="w-full mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              더 보기
            </button>
          )}
        </div>
      </div>

      {/* 최근 커뮤니티 활동 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">💬 최근 커뮤니티</h3>
            <Link 
              href="/community"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              전체보기
            </Link>
          </div>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            {mockRecentPosts.map((post) => (
              <div key={post.id} className="group">
                <Link href={`/community/${post.id}`}>
                  <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                    {post.title}
                  </h4>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-2">
                      <span className="flex items-center">
                        {post.author.isVerified && (
                          <svg className="h-3 w-3 text-blue-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                        {post.author.username}
                      </span>
                      <span>•</span>
                      <span>{formatTimeAgo(post.createdAt)}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center">
                        <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {post.likeCount}
                      </span>
                      <span className="flex items-center">
                        <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {post.commentCount}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 퀵 액션 */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-sm text-white">
        <div className="p-6">
          <h3 className="font-semibold mb-3">🚀 지금 시작하세요!</h3>
          <p className="text-blue-100 text-sm mb-4">
            로봇 커뮤니티에 참여하고 최신 정보를 공유해보세요.
          </p>
          <div className="space-y-2">
            <Link
              href="/community/new"
              className="block w-full py-2 px-4 bg-white/20 backdrop-blur-sm rounded-lg text-center text-sm font-medium hover:bg-white/30 transition-colors"
            >
              새 글 작성하기
            </Link>
            <Link
              href="/robots/compare"
              className="block w-full py-2 px-4 bg-white/20 backdrop-blur-sm rounded-lg text-center text-sm font-medium hover:bg-white/30 transition-colors"
            >
              로봇 비교하기
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}