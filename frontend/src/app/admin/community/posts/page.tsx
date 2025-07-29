'use client';

import { useState } from 'react';
import { CommunityPost, CommunityCategory } from '@/lib/types';
import { getDummyPosts } from '@/lib/dummy-data';
import Dropdown, { DropdownOption } from '@/components/ui/Dropdown';

export default function AdminCommunityPostsPage() {
  const [posts, setPosts] = useState<CommunityPost[]>(getDummyPosts());
  const [selectedCategory, setSelectedCategory] = useState<CommunityCategory | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'published' | 'pending' | 'pinned'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);

  const categoryOptions: DropdownOption[] = [
    { value: 'all', label: '전체' },
    { value: 'general', label: '일반' },
    { value: 'technical', label: '기술' },
    { value: 'showcase', label: '쇼케이스' },
    { value: 'question', label: '질문' },
    { value: 'discussion', label: '토론' },
  ];

  const statusOptions: DropdownOption[] = [
    { value: 'all', label: '전체' },
    { value: 'published', label: '게시됨' },
    { value: 'pinned', label: '고정됨' },
  ];

  const categories: { value: CommunityCategory | 'all'; label: string }[] = [
    { value: 'all', label: '전체' },
    { value: 'general', label: '일반' },
    { value: 'technical', label: '기술' },
    { value: 'showcase', label: '쇼케이스' },
    { value: 'question', label: '질문' },
    { value: 'discussion', label: '토론' },
  ];

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesStatus = 
      selectedStatus === 'all' || 
      (selectedStatus === 'pinned' && post.isPinned) ||
      (selectedStatus === 'published' && !post.isPinned);
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.username.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const handleSelectAll = () => {
    if (selectedPosts.length === filteredPosts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(filteredPosts.map(p => p.id));
    }
  };

  const handleSelect = (id: string) => {
    if (selectedPosts.includes(id)) {
      setSelectedPosts(selectedPosts.filter(pid => pid !== id));
    } else {
      setSelectedPosts([...selectedPosts, id]);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      setPosts(posts.filter(p => p.id !== id));
      setSelectedPosts(selectedPosts.filter(pid => pid !== id));
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`선택한 ${selectedPosts.length}개의 게시글을 삭제하시겠습니까?`)) {
      setPosts(posts.filter(p => !selectedPosts.includes(p.id)));
      setSelectedPosts([]);
    }
  };

  const handleTogglePin = (id: string) => {
    setPosts(posts.map(p => 
      p.id === id ? { ...p, isPinned: !p.isPinned } : p
    ));
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">게시글 관리</h1>
        <p className="mt-2 text-gray-600">커뮤니티 게시글을 관리하고 모더레이션합니다.</p>
      </div>

      {/* 필터 및 검색 */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="게시글 제목, 내용, 작성자 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <Dropdown
            options={categoryOptions}
            value={selectedCategory}
            onChange={(value) => setSelectedCategory(value as CommunityCategory | 'all')}
            className="w-32"
          />
          <Dropdown
            options={statusOptions}
            value={selectedStatus}
            onChange={(value) => setSelectedStatus(value as 'all' | 'published' | 'pinned')}
            className="w-32"
          />
          {selectedPosts.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              선택 삭제 ({selectedPosts.length})
            </button>
          )}
        </div>
      </div>

      {/* 게시글 목록 테이블 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedPosts.length === filteredPosts.length && filteredPosts.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                게시글
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                작성자
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                카테고리
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                통계
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                작성일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPosts.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedPosts.includes(post.id)}
                    onChange={() => handleSelect(post.id)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900 line-clamp-1">
                      {post.title}
                    </div>
                    <div className="text-sm text-gray-500 line-clamp-1">
                      {post.content}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {post.author.username.charAt(0)}
                      </span>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {post.author.username}
                      </div>
                      {post.author.isVerified && (
                        <span className="text-xs text-blue-600">인증됨</span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                    {categories.find(c => c.value === post.category)?.label}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    <div className="flex items-center gap-3 text-xs">
                      <span title="조회수">👁 {post.viewCount}</span>
                      <span title="좋아요">❤️ {post.likeCount}</span>
                      <span title="댓글">💬 {post.commentCount}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {formatDate(post.createdAt)}
                </td>
                <td className="px-6 py-4">
                  {post.isPinned && (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      고정됨
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleTogglePin(post.id)}
                      className={`${
                        post.isPinned ? 'text-yellow-600 hover:text-yellow-900' : 'text-gray-600 hover:text-gray-900'
                      }`}
                      title={post.isPinned ? '고정 해제' : '고정'}
                    >
                      📌
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}