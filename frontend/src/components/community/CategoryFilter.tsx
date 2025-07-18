'use client';

import { CommunityCategory } from '@/lib/types';

interface CategoryFilterProps {
  selectedCategory: CommunityCategory | 'all';
  onCategoryChange: (category: CommunityCategory | 'all') => void;
}

const categories: Array<{ value: CommunityCategory | 'all'; label: string; icon: string }> = [
  { value: 'all', label: '전체', icon: '📋' },
  { value: 'general', label: '일반', icon: '💬' },
  { value: 'technical', label: '기술', icon: '🔧' },
  { value: 'showcase', label: '쇼케이스', icon: '🎨' },
  { value: 'question', label: '질문', icon: '❓' },
  { value: 'discussion', label: '토론', icon: '🗣️' },
];

export default function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category.value}
          onClick={() => onCategoryChange(category.value)}
          className={`
            px-4 py-2 rounded-full text-sm font-medium transition-all
            ${
              selectedCategory === category.value
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
        >
          <span className="mr-1">{category.icon}</span>
          {category.label}
        </button>
      ))}
    </div>
  );
}