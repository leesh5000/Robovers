'use client';

import Link from 'next/link';
import { useState } from 'react';

interface CommunityStats {
  totalPosts: number;
  totalComments: number;
  pendingReports: number;
  activeUsers: number;
  todayPosts: number;
  todayComments: number;
}

export default function AdminCommunityPage() {
  const [stats] = useState<CommunityStats>({
    totalPosts: 892,
    totalComments: 3456,
    pendingReports: 5,
    activeUsers: 234,
    todayPosts: 23,
    todayComments: 89,
  });

  const menuItems = [
    {
      title: '게시글 관리',
      description: '커뮤니티 게시글을 관리하고 검토합니다',
      href: '/admin/community/posts',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
      stats: {
        label: '총 게시글',
        value: stats.totalPosts,
        trend: `오늘 +${stats.todayPosts}`
      },
      color: 'blue'
    },
    {
      title: '댓글 관리',
      description: '사용자 댓글을 모니터링하고 관리합니다',
      href: '/admin/community/comments',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      stats: {
        label: '총 댓글',
        value: stats.totalComments,
        trend: `오늘 +${stats.todayComments}`
      },
      color: 'green'
    },
    {
      title: '신고 관리',
      description: '신고된 콘텐츠를 검토하고 처리합니다',
      href: '/admin/community/reports',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      stats: {
        label: '대기중인 신고',
        value: stats.pendingReports,
        trend: '즉시 처리 필요'
      },
      color: 'red'
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">커뮤니티 관리</h1>
        <p className="mt-2 text-gray-600">커뮤니티 활동을 모니터링하고 관리합니다</p>
      </div>

      {/* 통계 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">전체 게시글</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalPosts.toLocaleString()}</p>
              <p className="text-sm text-green-600 mt-1">오늘 +{stats.todayPosts}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">전체 댓글</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalComments.toLocaleString()}</p>
              <p className="text-sm text-green-600 mt-1">오늘 +{stats.todayComments}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">활성 사용자</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.activeUsers.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-1">최근 7일</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">대기중인 신고</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.pendingReports}</p>
              <p className="text-sm text-red-600 mt-1">즉시 처리 필요</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 관리 메뉴 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 border border-gray-200 hover:border-blue-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 bg-${item.color}-100 rounded-lg`}>
                <div className={`text-${item.color}-600`}>{item.icon}</div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">{item.stats.label}</p>
                <p className="text-xl font-bold text-gray-900">{item.stats.value.toLocaleString()}</p>
                <p className={`text-xs ${item.color === 'red' ? 'text-red-600' : 'text-gray-500'} mt-1`}>
                  {item.stats.trend}
                </p>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.description}</p>
            <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
              관리하기
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {/* 최근 활동 */}
      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">최근 커뮤니티 활동</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">새 게시글 &quot;휴머노이드 로봇의 미래는?&quot; 작성됨</p>
                <p className="text-xs text-gray-500 mt-1">user123 · 5분 전</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">스팸 게시글 신고 접수</p>
                <p className="text-xs text-gray-500 mt-1">user456 · 15분 전</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">인기 게시글 댓글 20개 돌파</p>
                <p className="text-xs text-gray-500 mt-1">&quot;Atlas 로봇 리뷰&quot; 게시글 · 30분 전</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}