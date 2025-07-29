'use client';

import { useState } from 'react';
import Link from 'next/link';

interface DashboardStats {
  totalArticles: number;
  totalRobots: number;
  totalCompanies: number;
  totalUsers: number;
  totalPosts: number;
  pendingReports: number;
}

interface RecentActivity {
  id: string;
  type: 'article' | 'robot' | 'company' | 'post' | 'user';
  action: string;
  timestamp: Date;
  user: string;
}

export default function AdminDashboardPage() {
  const [stats] = useState<DashboardStats>({
    totalArticles: 156,
    totalRobots: 28,
    totalCompanies: 10,
    totalUsers: 1234,
    totalPosts: 892,
    pendingReports: 5,
  });

  const [recentActivities] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'article',
      action: '새 기사 "Tesla Optimus Gen 3 공개" 작성',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      user: '관리자',
    },
    {
      id: '2',
      type: 'robot',
      action: 'Figure 01 로봇 정보 업데이트',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      user: '편집자1',
    },
    {
      id: '3',
      type: 'post',
      action: '커뮤니티 게시글 "스팸 광고" 삭제',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      user: '모더레이터',
    },
    {
      id: '4',
      type: 'company',
      action: 'Boston Dynamics 주가 정보 업데이트',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      user: '관리자',
    },
    {
      id: '5',
      type: 'user',
      action: '신규 사용자 15명 가입',
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
      user: '시스템',
    },
  ]);

  const statCards = [
    {
      title: '총 기사',
      value: stats.totalArticles,
      icon: (
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
      link: '/admin/articles',
      bgColor: 'bg-blue-50',
    },
    {
      title: '등록된 로봇',
      value: stats.totalRobots,
      icon: (
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      ),
      link: '/admin/robots',
      bgColor: 'bg-green-50',
    },
    {
      title: '등록된 기업',
      value: stats.totalCompanies,
      icon: (
        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      link: '/admin/companies',
      bgColor: 'bg-purple-50',
    },
    {
      title: '총 사용자',
      value: stats.totalUsers.toLocaleString(),
      icon: (
        <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      link: '/admin/users',
      bgColor: 'bg-yellow-50',
    },
    {
      title: '커뮤니티 게시글',
      value: stats.totalPosts,
      icon: (
        <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
        </svg>
      ),
      link: '/admin/community',
      bgColor: 'bg-indigo-50',
    },
    {
      title: '대기중인 신고',
      value: stats.pendingReports,
      icon: (
        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      link: '/admin/community/reports',
      bgColor: 'bg-red-50',
    },
  ];

  const formatTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 60) return `${minutes}분 전`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}시간 전`;
    const days = Math.floor(hours / 24);
    return `${days}일 전`;
  };

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'article':
        return <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>;
      case 'robot':
        return <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>;
      case 'company':
        return <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>;
      case 'post':
        return <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>;
      case 'user':
        return <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">관리자 대시보드</h1>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((card) => (
          <Link
            key={card.title}
            href={card.link}
            className={`${card.bgColor} rounded-lg p-6 hover:shadow-lg transition-shadow`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{card.value}</p>
              </div>
              {card.icon}
            </div>
          </Link>
        ))}
      </div>

      {/* 최근 활동 */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">최근 활동</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="px-6 py-4 flex items-center gap-4">
              {getActivityIcon(activity.type)}
              <div className="flex-1">
                <p className="text-sm text-gray-900">{activity.action}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {activity.user} · {formatTimeAgo(activity.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-gray-200">
          <Link
            href="/admin/activity"
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            모든 활동 보기 →
          </Link>
        </div>
      </div>

      {/* 빠른 작업 */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/admin/articles/new"
          className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-500 hover:shadow transition-all flex items-center gap-3"
        >
          <div className="p-2 bg-blue-100 rounded-lg">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="font-medium text-gray-900">새 기사 작성</span>
        </Link>
        
        <Link
          href="/admin/robots/new"
          className="bg-white rounded-lg p-4 border border-gray-200 hover:border-green-500 hover:shadow transition-all flex items-center gap-3"
        >
          <div className="p-2 bg-green-100 rounded-lg">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="font-medium text-gray-900">로봇 등록</span>
        </Link>
        
        <Link
          href="/admin/companies/new"
          className="bg-white rounded-lg p-4 border border-gray-200 hover:border-purple-500 hover:shadow transition-all flex items-center gap-3"
        >
          <div className="p-2 bg-purple-100 rounded-lg">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="font-medium text-gray-900">기업 등록</span>
        </Link>
        
        <Link
          href="/admin/community/reports"
          className="bg-white rounded-lg p-4 border border-gray-200 hover:border-red-500 hover:shadow transition-all flex items-center gap-3"
        >
          <div className="p-2 bg-red-100 rounded-lg">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <span className="font-medium text-gray-900">신고 처리</span>
        </Link>
      </div>
    </div>
  );
}