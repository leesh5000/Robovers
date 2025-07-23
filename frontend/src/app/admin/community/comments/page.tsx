'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Comment, CommunityPost } from '@/lib/types';
import { getDummyCommentsForAdmin } from '@/lib/dummy-data-admin';
import Dropdown, { DropdownOption } from '@/components/ui/Dropdown';
import Pagination from '@/components/ui/Pagination';
import { handleCommentClick } from './comment-click';

interface AdminComment extends Comment {
  postId: string;
  postTitle: string;
  status: 'visible' | 'hidden' | 'reported';
  reportCount?: number;
}

interface CommentFilters {
  searchQuery: string;
  status: 'all' | 'visible' | 'hidden' | 'reported';
  dateRange: 'all' | 'today' | 'week' | 'month';
  sortBy: 'recent' | 'likes' | 'reports';
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<AdminComment[]>([]);
  const [selectedComments, setSelectedComments] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [bulkAction, setBulkAction] = useState<'delete' | 'hide' | 'show' | null>(null);
  
  const [filters, setFilters] = useState<CommentFilters>({
    searchQuery: '',
    status: 'all',
    dateRange: 'all',
    sortBy: 'recent'
  });

  const commentsPerPage = 20;

  useEffect(() => {
    // 더미 데이터 로드
    setIsLoading(true);
    setTimeout(() => {
      const adminComments = getDummyCommentsForAdmin();
      setComments(adminComments);
      setIsLoading(false);
    }, 1000);
  }, []);

  // 필터링된 댓글
  const filteredComments = useMemo(() => {
    let filtered = [...comments];

    // 검색어 필터
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(comment => 
        comment.content.toLowerCase().includes(query) ||
        comment.author.username.toLowerCase().includes(query) ||
        comment.postTitle.toLowerCase().includes(query)
      );
    }

    // 상태 필터
    if (filters.status !== 'all') {
      filtered = filtered.filter(comment => comment.status === filters.status);
    }

    // 날짜 필터
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const dateFilter = {
        today: 24 * 60 * 60 * 1000,
        week: 7 * 24 * 60 * 60 * 1000,
        month: 30 * 24 * 60 * 60 * 1000
      };
      const timeLimit = dateFilter[filters.dateRange];
      filtered = filtered.filter(comment => 
        now.getTime() - new Date(comment.createdAt).getTime() < timeLimit
      );
    }

    // 정렬
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'likes':
          return b.likeCount - a.likeCount;
        case 'reports':
          return (b.reportCount || 0) - (a.reportCount || 0);
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return filtered;
  }, [comments, filters]);

  // 페이지네이션
  const totalPages = Math.ceil(filteredComments.length / commentsPerPage);
  const paginatedComments = filteredComments.slice(
    (currentPage - 1) * commentsPerPage,
    currentPage * commentsPerPage
  );

  // 통계
  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return {
      total: comments.length,
      today: comments.filter(c => new Date(c.createdAt) >= today).length,
      reported: comments.filter(c => c.status === 'reported').length,
      hidden: comments.filter(c => c.status === 'hidden').length
    };
  }, [comments]);

  const handleSelectAll = () => {
    if (selectedComments.length === paginatedComments.length) {
      setSelectedComments([]);
    } else {
      setSelectedComments(paginatedComments.map(c => c.id));
    }
  };

  const handleSelectComment = (commentId: string) => {
    setSelectedComments(prev => 
      prev.includes(commentId) 
        ? prev.filter(id => id !== commentId)
        : [...prev, commentId]
    );
  };

  const handleDeleteComment = (commentId: string) => {
    setCommentToDelete(commentId);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (commentToDelete) {
      setComments(prev => prev.filter(c => c.id !== commentToDelete));
      setSelectedComments(prev => prev.filter(id => id !== commentToDelete));
    } else if (bulkAction === 'delete' && selectedComments.length > 0) {
      setComments(prev => prev.filter(c => !selectedComments.includes(c.id)));
      setSelectedComments([]);
    }
    setShowDeleteModal(false);
    setCommentToDelete(null);
    setBulkAction(null);
  };

  const handleToggleVisibility = (commentId: string, currentStatus: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, status: currentStatus === 'visible' ? 'hidden' : 'visible' as AdminComment['status'] }
        : comment
    ));
  };

  const handleBulkAction = (action: 'delete' | 'hide' | 'show') => {
    if (selectedComments.length === 0) return;

    if (action === 'delete') {
      setBulkAction('delete');
      setShowDeleteModal(true);
    } else {
      const newStatus = action === 'hide' ? 'hidden' : 'visible';
      setComments(prev => prev.map(comment => 
        selectedComments.includes(comment.id)
          ? { ...comment, status: newStatus as AdminComment['status'] }
          : comment
      ));
      setSelectedComments([]);
    }
  };

  const statusOptions: DropdownOption[] = [
    { value: 'all', label: '전체 상태' },
    { value: 'visible', label: '표시됨' },
    { value: 'hidden', label: '숨김' },
    { value: 'reported', label: '신고됨' }
  ];

  const dateRangeOptions: DropdownOption[] = [
    { value: 'all', label: '전체 기간' },
    { value: 'today', label: '오늘' },
    { value: 'week', label: '최근 1주' },
    { value: 'month', label: '최근 1개월' }
  ];

  const sortOptions: DropdownOption[] = [
    { value: 'recent', label: '최신순' },
    { value: 'likes', label: '좋아요순' },
    { value: 'reports', label: '신고순' }
  ];

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">댓글 관리</h1>
        <p className="text-gray-600">커뮤니티에 작성된 모든 댓글을 관리합니다.</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">전체 댓글</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">오늘 작성</p>
          <p className="text-2xl font-bold text-gray-900">{stats.today.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">신고된 댓글</p>
          <p className="text-2xl font-bold text-red-600">{stats.reported.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">숨김 처리</p>
          <p className="text-2xl font-bold text-gray-500">{stats.hidden.toLocaleString()}</p>
        </div>
      </div>

      {/* 필터 및 액션 */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* 검색 */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="댓글 내용, 작성자, 게시글 제목 검색..."
              value={filters.searchQuery}
              onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 필터 */}
          <div className="flex gap-2">
            <Dropdown
              options={statusOptions}
              value={filters.status}
              onChange={(value) => setFilters(prev => ({ ...prev, status: value as CommentFilters['status'] }))}
              size="sm"
              className="w-32"
            />
            <Dropdown
              options={dateRangeOptions}
              value={filters.dateRange}
              onChange={(value) => setFilters(prev => ({ ...prev, dateRange: value as CommentFilters['dateRange'] }))}
              size="sm"
              className="w-32"
            />
            <Dropdown
              options={sortOptions}
              value={filters.sortBy}
              onChange={(value) => setFilters(prev => ({ ...prev, sortBy: value as CommentFilters['sortBy'] }))}
              size="sm"
              className="w-32"
            />
          </div>
        </div>

        {/* 대량 작업 */}
        {selectedComments.length > 0 && (
          <div className="mt-4 flex items-center gap-2 pt-4 border-t border-gray-200">
            <span className="text-sm text-gray-600">
              {selectedComments.length}개 선택됨
            </span>
            <button
              onClick={() => handleBulkAction('show')}
              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
            >
              표시
            </button>
            <button
              onClick={() => handleBulkAction('hide')}
              className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700"
            >
              숨김
            </button>
            <button
              onClick={() => handleBulkAction('delete')}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            >
              삭제
            </button>
          </div>
        )}
      </div>

      {/* 댓글 테이블 */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedComments.length === paginatedComments.length && paginatedComments.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300"
                />
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">댓글 내용</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">작성자</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">게시글</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">작성일</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">상태</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">액션</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedComments.map((comment) => (
              <tr key={comment.id} className="hover:bg-gray-50">
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedComments.includes(comment.id)}
                    onChange={() => handleSelectComment(comment.id)}
                    className="rounded border-gray-300"
                  />
                </td>
                <td className="px-4 py-4">
                  <div className="max-w-md">
                    <p 
                      className="text-sm text-gray-900 line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => handleCommentClick(comment.postId, comment.id)}
                    >
                      {comment.content}
                    </p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                      <span>좋아요 {comment.likeCount}</span>
                      {comment.replies && comment.replies.length > 0 && (
                        <span>답글 {comment.replies.length}</span>
                      )}
                      {comment.reportCount && comment.reportCount > 0 && (
                        <span className="text-red-600">신고 {comment.reportCount}</span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <span className="text-sm text-gray-900">{comment.author.username}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <Link
                    href={`/community/${comment.postId}`}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    {comment.postTitle}
                  </Link>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-gray-600">
                    {new Date(comment.createdAt).toLocaleDateString('ko-KR')}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    comment.status === 'visible' 
                      ? 'bg-green-100 text-green-800'
                      : comment.status === 'hidden'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {comment.status === 'visible' ? '표시됨' : comment.status === 'hidden' ? '숨김' : '신고됨'}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleToggleVisibility(comment.id, comment.status)}
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      {comment.status === 'visible' ? '숨기기' : '표시'}
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredComments.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">댓글 삭제</h3>
            <p className="text-gray-600 mb-6">
              {bulkAction === 'delete' && selectedComments.length > 0
                ? `선택한 ${selectedComments.length}개의 댓글을 삭제하시겠습니까?`
                : '이 댓글을 삭제하시겠습니까?'} 
              이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setCommentToDelete(null);
                  setBulkAction(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                취소
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}