'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Dropdown from '@/components/ui/Dropdown';
import Pagination from '@/components/ui/Pagination';
import { Comment, CommunityPost } from '@/lib/types';
import { getDummyComments, getDummyPosts } from '@/lib/dummy-data';

interface CommentWithPost extends Comment {
  post?: {
    id: string;
    title: string;
  };
  status?: 'visible' | 'hidden' | 'reported';
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<CommentWithPost[]>([]);
  const [filteredComments, setFilteredComments] = useState<CommentWithPost[]>([]);
  const [selectedComments, setSelectedComments] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 필터 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'visible' | 'hidden' | 'reported'>('all');
  const [filterPost, setFilterPost] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'oldest' | 'mostLiked' | 'mostReplies'>('latest');
  
  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  
  // 통계
  const [stats, setStats] = useState({
    totalComments: 0,
    todayComments: 0,
    reportedComments: 0,
    hiddenComments: 0,
  });

  // 모달 상태
  const [selectedComment, setSelectedComment] = useState<CommentWithPost | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBulkActionModal, setShowBulkActionModal] = useState(false);
  const [bulkAction, setBulkAction] = useState<'hide' | 'show' | 'delete' | null>(null);

  const posts = getDummyPosts();

  useEffect(() => {
    loadComments();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [comments, searchQuery, filterStatus, filterPost, sortBy]);

  const loadComments = () => {
    setIsLoading(true);
    
    // 모든 게시글의 댓글을 수집
    const allComments: CommentWithPost[] = [];
    posts.forEach(post => {
      const postComments = getDummyComments(post.id);
      postComments.forEach(comment => {
        // 댓글과 대댓글 모두 포함
        const processComment = (c: Comment, postInfo: { id: string; title: string }) => {
          allComments.push({
            ...c,
            post: postInfo,
            status: Math.random() > 0.9 ? 'reported' : Math.random() > 0.95 ? 'hidden' : 'visible',
          });
          
          if (c.replies) {
            c.replies.forEach(reply => processComment(reply, postInfo));
          }
        };
        
        processComment(comment, { id: post.id, title: post.title });
      });
    });
    
    // 통계 계산
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayComments = allComments.filter(c => 
      new Date(c.createdAt) >= today
    ).length;
    
    setStats({
      totalComments: allComments.length,
      todayComments: todayComments || Math.floor(Math.random() * 50) + 10, // 더미 데이터
      reportedComments: allComments.filter(c => c.status === 'reported').length,
      hiddenComments: allComments.filter(c => c.status === 'hidden').length,
    });
    
    setComments(allComments);
    setIsLoading(false);
  };

  const applyFilters = () => {
    let filtered = [...comments];
    
    // 검색 필터
    if (searchQuery) {
      filtered = filtered.filter(comment =>
        comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comment.author.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // 상태 필터
    if (filterStatus !== 'all') {
      filtered = filtered.filter(comment => comment.status === filterStatus);
    }
    
    // 게시글 필터
    if (filterPost !== 'all') {
      filtered = filtered.filter(comment => comment.post?.id === filterPost);
    }
    
    // 정렬
    switch (sortBy) {
      case 'latest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'mostLiked':
        filtered.sort((a, b) => b.likeCount - a.likeCount);
        break;
      case 'mostReplies':
        filtered.sort((a, b) => (b.replies?.length || 0) - (a.replies?.length || 0));
        break;
    }
    
    setFilteredComments(filtered);
    setCurrentPage(1);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const pageComments = getPaginatedComments();
      setSelectedComments(pageComments.map(c => c.id));
    } else {
      setSelectedComments([]);
    }
  };

  const handleSelectComment = (commentId: string) => {
    setSelectedComments(prev =>
      prev.includes(commentId)
        ? prev.filter(id => id !== commentId)
        : [...prev, commentId]
    );
  };

  const handleStatusChange = (commentId: string, newStatus: 'visible' | 'hidden') => {
    setComments(prev =>
      prev.map(comment =>
        comment.id === commentId ? { ...comment, status: newStatus } : comment
      )
    );
  };

  const handleDelete = (commentId: string) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId));
    setShowDeleteModal(false);
    setSelectedComment(null);
  };

  const handleBulkAction = () => {
    if (!bulkAction) return;
    
    switch (bulkAction) {
      case 'hide':
        setComments(prev =>
          prev.map(comment =>
            selectedComments.includes(comment.id)
              ? { ...comment, status: 'hidden' as const }
              : comment
          )
        );
        break;
      case 'show':
        setComments(prev =>
          prev.map(comment =>
            selectedComments.includes(comment.id)
              ? { ...comment, status: 'visible' as const }
              : comment
          )
        );
        break;
      case 'delete':
        setComments(prev =>
          prev.filter(comment => !selectedComments.includes(comment.id))
        );
        break;
    }
    
    setSelectedComments([]);
    setShowBulkActionModal(false);
    setBulkAction(null);
  };

  const getPaginatedComments = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredComments.slice(startIndex, endIndex);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const getStatusBadge = (status?: 'visible' | 'hidden' | 'reported') => {
    switch (status) {
      case 'hidden':
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">숨김</span>;
      case 'reported':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-600 rounded-full">신고됨</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-600 rounded-full">표시중</span>;
    }
  };

  const statusOptions = [
    { value: 'all', label: '전체 상태' },
    { value: 'visible', label: '표시중' },
    { value: 'hidden', label: '숨김' },
    { value: 'reported', label: '신고됨' },
  ];

  const sortOptions = [
    { value: 'latest', label: '최신순' },
    { value: 'oldest', label: '오래된순' },
    { value: 'mostLiked', label: '좋아요순' },
    { value: 'mostReplies', label: '답글순' },
  ];

  const postOptions = [
    { value: 'all', label: '모든 게시글' },
    ...posts.slice(0, 10).map(post => ({
      value: post.id,
      label: post.title.length > 30 ? post.title.substring(0, 30) + '...' : post.title,
    })),
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">댓글 관리</h1>
        <p className="mt-2 text-gray-600">전체 플랫폼의 댓글을 관리하고 모니터링합니다</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">전체 댓글</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalComments.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">오늘의 댓글</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.todayComments}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">신고된 댓글</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.reportedComments}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">숨김 댓글</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.hiddenComments}</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 필터 및 검색 */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* 검색창 */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="댓글 내용 또는 작성자로 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg
                  className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* 필터 드롭다운 */}
            <div className="flex gap-2">
              <Dropdown
                options={statusOptions}
                value={filterStatus}
                onChange={(value) => setFilterStatus(value as any)}
                className="w-32"
              />
              <Dropdown
                options={postOptions}
                value={filterPost}
                onChange={setFilterPost}
                className="w-48"
              />
              <Dropdown
                options={sortOptions}
                value={sortBy}
                onChange={(value) => setSortBy(value as any)}
                className="w-32"
              />
            </div>
          </div>

          {/* 선택된 항목 액션 */}
          {selectedComments.length > 0 && (
            <div className="mt-4 flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-blue-900">
                {selectedComments.length}개 항목 선택됨
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setBulkAction('hide');
                    setShowBulkActionModal(true);
                  }}
                  className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  숨기기
                </button>
                <button
                  onClick={() => {
                    setBulkAction('show');
                    setShowBulkActionModal(true);
                  }}
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                >
                  표시하기
                </button>
                <button
                  onClick={() => {
                    setBulkAction('delete');
                    setShowBulkActionModal(true);
                  }}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                >
                  삭제
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 댓글 테이블 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center gap-2">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-600">댓글을 불러오는 중...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        onChange={handleSelectAll}
                        checked={selectedComments.length === getPaginatedComments().length && selectedComments.length > 0}
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      댓글 내용
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      작성자
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      게시글
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      작성일
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      상태
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      반응
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      작업
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getPaginatedComments().map((comment) => (
                    <tr key={comment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={selectedComments.includes(comment.id)}
                          onChange={() => handleSelectComment(comment.id)}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-md">
                          <p className="text-sm text-gray-900 line-clamp-2">
                            {comment.parentId && (
                              <span className="text-gray-500 mr-1">↳</span>
                            )}
                            {comment.content}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-600">
                              {comment.author.username.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{comment.author.username}</p>
                            <p className="text-xs text-gray-500">{comment.author.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {comment.post && (
                          <Link
                            href={`/community/${comment.post.id}`}
                            target="_blank"
                            className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {comment.post.title.length > 30 
                              ? comment.post.title.substring(0, 30) + '...' 
                              : comment.post.title}
                          </Link>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{formatDate(comment.createdAt)}</p>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(comment.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            {comment.likeCount}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            {comment.replies?.length || 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedComment(comment)}
                            className="text-gray-600 hover:text-gray-900"
                            title="미리보기"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          {comment.status === 'visible' ? (
                            <button
                              onClick={() => handleStatusChange(comment.id, 'hidden')}
                              className="text-gray-600 hover:text-gray-900"
                              title="숨기기"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                              </svg>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStatusChange(comment.id, 'visible')}
                              className="text-green-600 hover:text-green-700"
                              title="표시하기"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setSelectedComment(comment);
                              setShowDeleteModal(true);
                            }}
                            className="text-red-600 hover:text-red-700"
                            title="삭제"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 페이지네이션 */}
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  {filteredComments.length > 0 ? (
                    <>
                      {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredComments.length)} / 총 {filteredComments.length}개
                    </>
                  ) : (
                    '결과 없음'
                  )}
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(filteredComments.length / itemsPerPage)}
                  onPageChange={setCurrentPage}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* 댓글 미리보기 모달 */}
      {selectedComment && !showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">댓글 상세보기</h2>
                <button
                  onClick={() => setSelectedComment(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {/* 게시글 정보 */}
                {selectedComment.post && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">게시글</p>
                    <Link
                      href={`/community/${selectedComment.post.id}`}
                      target="_blank"
                      className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                    >
                      {selectedComment.post.title}
                    </Link>
                  </div>
                )}

                {/* 작성자 정보 */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-lg font-medium text-gray-600">
                      {selectedComment.author.username.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{selectedComment.author.username}</p>
                    <p className="text-sm text-gray-500">{selectedComment.author.email}</p>
                  </div>
                </div>

                {/* 댓글 내용 */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedComment.content}</p>
                </div>

                {/* 메타 정보 */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <span>{formatDate(selectedComment.createdAt)}</span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {selectedComment.likeCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      {selectedComment.replies?.length || 0} 답글
                    </span>
                  </div>
                  {getStatusBadge(selectedComment.status)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {showDeleteModal && selectedComment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 text-center mb-2">댓글 삭제</h3>
                <p className="text-sm text-gray-600 text-center">
                  이 댓글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedComment(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  onClick={() => handleDelete(selectedComment.id)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 일괄 작업 확인 모달 */}
      {showBulkActionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">일괄 작업 확인</h3>
                <p className="text-sm text-gray-600">
                  선택한 {selectedComments.length}개의 댓글에 대해 다음 작업을 수행하시겠습니까?
                </p>
                <p className="text-sm font-medium text-gray-900 mt-2">
                  {bulkAction === 'hide' && '숨기기'}
                  {bulkAction === 'show' && '표시하기'}
                  {bulkAction === 'delete' && '삭제하기'}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowBulkActionModal(false);
                    setBulkAction(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  onClick={handleBulkAction}
                  className={`flex-1 px-4 py-2 text-white rounded-lg ${
                    bulkAction === 'delete' 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}