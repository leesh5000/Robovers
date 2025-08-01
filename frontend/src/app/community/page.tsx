"use client";

import { useState } from "react";
import PostList from "@/components/community/PostList";
import CategoryFilter from "@/components/community/CategoryFilter";
import CreatePostButton from "@/components/community/CreatePostButton";
import Dropdown from "@/components/ui/Dropdown";
import SearchBar from "@/components/ui/SearchBar";
import { CommunityCategory, SortOption } from "@/lib/types";

export default function CommunityPage() {
  const [selectedCategory, setSelectedCategory] = useState<
    CommunityCategory | "all"
  >("all");
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [searchQuery, setSearchQuery] = useState("");

  const sortOptions = [
    { value: "latest", label: "최신순" },
    { value: "popular", label: "인기순" },
    { value: "trending", label: "트렌딩" },
    { value: "commented", label: "댓글 많은 순" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 페이지 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">커뮤니티</h1>
        <p className="text-gray-600">
          휴머노이드 로봇에 대한 지식을 공유하고 토론하는 공간입니다
        </p>
      </div>

      {/* 상단 컨트롤 영역 */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* 카테고리 필터 */}
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          {/* 검색 및 정렬 */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* 검색 */}
            <SearchBar
              placeholder="게시글 검색..."
              value={searchQuery}
              onChange={setSearchQuery}
              variant="no-icon"
              className="w-full sm:w-64"
            />

            {/* 정렬 옵션 */}
            <Dropdown
              options={sortOptions}
              value={sortBy}
              onChange={(value) => setSortBy(value as SortOption)}
              placeholder="정렬 방식"
              className="w-40"
            />
          </div>
        </div>
      </div>

      {/* 게시글 목록 */}
      <PostList
        category={selectedCategory}
        sortBy={sortBy}
        searchQuery={searchQuery}
      />

      {/* 글쓰기 버튼 */}
      <CreatePostButton />
    </div>
  );
}
