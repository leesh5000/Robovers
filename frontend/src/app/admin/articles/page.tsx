'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Article, ArticleCategory } from '@/lib/types';
import Dropdown, { DropdownOption } from '@/components/ui/Dropdown';

// 더미 기사 데이터
const dummyArticles: Article[] = [
  {
    id: '1',
    title: 'Tesla Optimus Gen 3 공개: 더욱 진화한 휴머노이드 로봇',
    content: '테슬라가 최신 휴머노이드 로봇 Optimus Gen 3를 공개했습니다...',
    excerpt: '테슬라가 최신 휴머노이드 로봇 Optimus Gen 3를 공개했습니다.',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
    author: '김로봇',
    source: 'Robovers',
    publishedAt: new Date('2024-01-15'),
    category: 'news',
    tags: ['Tesla', 'Optimus', '휴머노이드'],
    viewCount: 1523,
    likeCount: 234,
    commentCount: 45,
  },
  {
    id: '2',
    title: 'Boston Dynamics Atlas의 놀라운 파쿠르 실력',
    content: '보스턴 다이나믹스의 Atlas 로봇이 복잡한 파쿠르 코스를 완주했습니다...',
    excerpt: '보스턴 다이나믹스의 Atlas 로봇이 복잡한 파쿠르 코스를 완주했습니다.',
    imageUrl: 'https://images.unsplash.com/photo-1516192518150-0d8fee5425e3?w=800',
    author: '이기술',
    source: 'Robovers',
    publishedAt: new Date('2024-01-14'),
    category: 'tech-review',
    tags: ['Boston Dynamics', 'Atlas', '파쿠르'],
    viewCount: 892,
    likeCount: 156,
    commentCount: 23,
  },
];

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>(dummyArticles);
  const [selectedCategory, setSelectedCategory] = useState<ArticleCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);

  const categoryOptions: DropdownOption[] = [
    { value: 'all', label: '전체' },
    { value: 'news', label: '뉴스' },
    { value: 'tech-review', label: '기술 리뷰' },
    { value: 'company-update', label: '기업 소식' },
    { value: 'research', label: '연구' },
    { value: 'innovation', label: '혁신' },
  ];

  const categories: { value: ArticleCategory | 'all'; label: string }[] = [
    { value: 'all', label: '전체' },
    { value: 'news', label: '뉴스' },
    { value: 'tech-review', label: '기술 리뷰' },
    { value: 'company-update', label: '기업 소식' },
    { value: 'research', label: '연구' },
    { value: 'innovation', label: '혁신' },
  ];

  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectAll = () => {
    if (selectedArticles.length === filteredArticles.length) {
      setSelectedArticles([]);
    } else {
      setSelectedArticles(filteredArticles.map(a => a.id));
    }
  };

  const handleSelect = (id: string) => {
    if (selectedArticles.includes(id)) {
      setSelectedArticles(selectedArticles.filter(aid => aid !== id));
    } else {
      setSelectedArticles([...selectedArticles, id]);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('정말로 이 기사를 삭제하시겠습니까?')) {
      setArticles(articles.filter(a => a.id !== id));
      setSelectedArticles(selectedArticles.filter(aid => aid !== id));
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`선택한 ${selectedArticles.length}개의 기사를 삭제하시겠습니까?`)) {
      setArticles(articles.filter(a => !selectedArticles.includes(a.id)));
      setSelectedArticles([]);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">기사 관리</h1>
        <Link
          href="/admin/articles/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          새 기사 작성
        </Link>
      </div>

      {/* 필터 및 검색 */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="기사 제목 또는 내용 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Dropdown
            options={categoryOptions}
            value={selectedCategory}
            onChange={(value) => setSelectedCategory(value as ArticleCategory | 'all')}
            className="w-32"
          />
          {selectedArticles.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              선택 삭제 ({selectedArticles.length})
            </button>
          )}
        </div>
      </div>

      {/* 기사 목록 테이블 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedArticles.length === filteredArticles.length && filteredArticles.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                기사
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                카테고리
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                작성자
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                통계
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                게시일
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredArticles.map((article) => (
              <tr key={article.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedArticles.includes(article.id)}
                    onChange={() => handleSelect(article.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {article.imageUrl && (
                      <Image
                        src={article.imageUrl}
                        alt=""
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded object-cover mr-3"
                      />
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">{article.title}</div>
                      <div className="text-sm text-gray-500">{article.excerpt}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {categories.find(c => c.value === article.category)?.label}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{article.author}</td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {article.viewCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {article.likeCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {article.commentCount}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(article.publishedAt).toLocaleDateString('ko-KR')}
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/articles/${article.id}/edit`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      편집
                    </Link>
                    <button
                      onClick={() => handleDelete(article.id)}
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
        
        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}