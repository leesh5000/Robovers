import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ArticleCard from './ArticleCard';
import { Article } from '@/lib/types';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, fill, ...props }: any) => {
    // fill prop을 제거하고 나머지 props만 전달
    const imgProps = { ...props };
    delete imgProps.fill;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} {...imgProps} />
    );
  },
}));

// Mock data
const mockArticle: Article = {
  id: '1',
  title: 'OpenAI의 새로운 휴머노이드 로봇 "Figure-01" 공개',
  content: '인공지능 선도기업 OpenAI가 휴머노이드 로봇 Figure-01을 공개했습니다...',
  excerpt: 'OpenAI가 Figure AI와 협력하여 개발한 휴머노이드 로봇이 일반 작업 환경에서 자연스럽게 대화하며 작업을 수행하는 모습을 선보였습니다.',
  imageUrl: 'https://example.com/robot.jpg',
  author: '로봇 뉴스팀',
  source: 'TechCrunch',
  publishedAt: new Date('2024-01-15T10:00:00Z'),
  category: 'news',
  tags: ['OpenAI', 'Figure AI', '휴머노이드', '인공지능'],
  viewCount: 1250,
  likeCount: 89,
  commentCount: 23,
  isBookmarked: false,
};

describe('ArticleCard', () => {
  // TDD: Red Phase - 테스트를 먼저 작성
  
  it('should render article information correctly', () => {
    render(<ArticleCard article={mockArticle} />);
    
    // 제목 확인
    expect(screen.getByText(mockArticle.title)).toBeInTheDocument();
    
    // 요약 확인
    expect(screen.getByText(mockArticle.excerpt)).toBeInTheDocument();
    
    // 작성자 및 출처 확인
    expect(screen.getByText(`${mockArticle.author} · ${mockArticle.source}`)).toBeInTheDocument();
    
    // 통계 확인 - 텍스트가 다른 요소와 함께 있으므로 부분 매칭
    expect(screen.getByText(/1,250/)).toBeInTheDocument(); // 조회수
    expect(screen.getByText('89')).toBeInTheDocument(); // 좋아요
    expect(screen.getByText('23')).toBeInTheDocument(); // 댓글
  });

  it('should display image when imageUrl is provided', () => {
    render(<ArticleCard article={mockArticle} />);
    
    const image = screen.getByAltText(mockArticle.title);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockArticle.imageUrl);
  });

  it('should not display image when imageUrl is not provided', () => {
    const articleWithoutImage = { ...mockArticle, imageUrl: undefined };
    render(<ArticleCard article={articleWithoutImage} />);
    
    const image = screen.queryByAltText(mockArticle.title);
    expect(image).not.toBeInTheDocument();
  });

  it('should display tags', () => {
    const { container } = render(<ArticleCard article={mockArticle} />);
    
    // 태그 컨테이너 찾기
    const tagElements = container.querySelectorAll('.px-2.py-1.text-xs.text-gray-500.bg-gray-100');
    
    // 처음 3개의 태그만 표시됨
    expect(tagElements).toHaveLength(3);
    expect(tagElements[0].textContent).toBe('#OpenAI');
    expect(tagElements[1].textContent).toBe('#Figure AI');
    expect(tagElements[2].textContent).toBe('#휴머노이드');
    
    // +1개 표시 확인
    expect(screen.getByText('+1개')).toBeInTheDocument();
  });

  it('should format date correctly', () => {
    render(<ArticleCard article={mockArticle} />);
    
    // 날짜 포맷팅 확인 (상대적 시간 또는 절대적 시간)
    // 예: "2시간 전" 또는 "2024년 1월 15일"
    const dateElement = screen.getByText(/전$|년|월|일/);
    expect(dateElement).toBeInTheDocument();
  });

  it('should call onBookmark when bookmark button is clicked', () => {
    const mockOnBookmark = jest.fn();
    render(<ArticleCard article={mockArticle} onBookmark={mockOnBookmark} />);
    
    const bookmarkButton = screen.getByRole('button', { name: /북마크/i });
    fireEvent.click(bookmarkButton);
    
    expect(mockOnBookmark).toHaveBeenCalledWith(mockArticle.id);
  });

  it('should show bookmarked state correctly', () => {
    const bookmarkedArticle = { ...mockArticle, isBookmarked: true };
    render(<ArticleCard article={bookmarkedArticle} />);
    
    const bookmarkButton = screen.getByRole('button', { name: /북마크/i });
    // SVG 요소 찾기
    const svg = bookmarkButton.querySelector('svg');
    expect(svg).toHaveClass('text-yellow-500');
    expect(svg).toHaveClass('fill-current');
  });

  it('should handle category display', () => {
    render(<ArticleCard article={mockArticle} />);
    
    // 카테고리가 표시되는지 확인 (카테고리 레이블은 '뉴스'로 표시됨)
    const categoryBadge = screen.getByText('뉴스');
    expect(categoryBadge).toBeInTheDocument();
  });

  it('should be clickable and navigate to article detail', () => {
    const mockOnClick = jest.fn();
    render(<ArticleCard article={mockArticle} onClick={mockOnClick} />);
    
    // 카드 클릭
    const card = screen.getByRole('article');
    fireEvent.click(card);
    
    expect(mockOnClick).toHaveBeenCalledWith(mockArticle.id);
  });

  it('should handle missing optional props gracefully', () => {
    const minimalArticle: Article = {
      ...mockArticle,
      tags: [],
      imageUrl: undefined,
      source: '',
    };
    
    // 에러 없이 렌더링되어야 함
    expect(() => render(<ArticleCard article={minimalArticle} />)).not.toThrow();
  });
});