'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import MainFeed from '@/components/feed/MainFeed';
import Sidebar from '@/components/layout/Sidebar';
import { Article, ArticleCategory } from '@/lib/types';

// 현실적인 로봇 관련 데이터 풀
const robotNewsData = {
  titles: [
    '삼성전자, AI 가정용 로봇 "봇 핸디" CES 2025 공개 예정',
    '테슬라 옵티머스 Gen 2, 달걀 집기 성공... 섬세한 작업 가능',
    '아마존, 창고 로봇 "디지트" 100만대 도입 계획 발표',
    'Figure AI, OpenAI와 협력으로 대화형 휴머노이드 로봇 개발',
    '소프트뱅크, 감정 인식 로봇 "페퍼" 차세대 모델 출시',
    '구글 딥마인드, 로봇 학습용 AI 모델 "RT-2" 오픈소스 공개',
    '현대로보틱스, 협동로봇 시장 점유율 국내 1위 달성',
    '중국 샤오미, 휴머노이드 로봇 "사이버원" 양산 체제 돌입',
    'LG전자, 양족 보행 로봇 "클로이" 호텔 서비스 시작',
    '메타, VR 연동 원격 로봇 제어 기술 시연',
    'ABB, 산업용 로봇 AI 비전 시스템 업그레이드',
    '한국로봇산업진흥원, 2025년 로봇 산업 투자 5조원 목표',
    '일본 혼다, ASIMO 후속 모델 개발 중단... 산업용 로봇 집중',
    'OpenAI, 로봇 스타트업 1X에 1억 달러 추가 투자',
    '네이버랩스, 실내 자율주행 로봇 "어라운드" 상용화',
    '카이스트, 4족 보행 로봇 "라이보" 국제 대회 우승',
    '우리로봇, 교육용 로봇 "알파미니" 글로벌 수출 확대',
    '두산로보틱스, 협동로봇 누적 판매 1만대 돌파',
    'BMW, 휴머노이드 로봇 도입으로 생산성 40% 향상',
    '애플, 로봇 청소기 시장 진출 루머... 다이슨과 경쟁 예고'
  ],
  excerpts: [
    '차세대 AI 기술을 탑재한 로봇이 일상생활에 더욱 가까워지고 있습니다.',
    '정밀한 모터 제어와 센서 기술의 발전으로 로봇의 작업 능력이 크게 향상되었습니다.',
    '대규모 투자와 기술 혁신으로 로봇 산업이 새로운 전환점을 맞이하고 있습니다.',
    '인간-로봇 협업의 새로운 패러다임이 제시되며 산업 현장이 변화하고 있습니다.',
    '최신 AI 모델의 적용으로 로봇의 학습 능력과 적응력이 획기적으로 개선되었습니다.',
    '글로벌 기업들의 로봇 기술 경쟁이 치열해지며 혁신의 속도가 가속화되고 있습니다.',
    '로봇 기술의 상용화가 본격화되며 일상생활 속 로봇의 역할이 확대되고 있습니다.',
    '차세대 센서와 액추에이터 기술로 로봇의 물리적 능력이 인간 수준에 근접하고 있습니다.',
    '로봇 산업의 생태계가 확장되며 새로운 비즈니스 모델이 등장하고 있습니다.',
    '인공지능과 로봇 기술의 융합으로 전례 없는 혁신이 이루어지고 있습니다.'
  ],
  authors: [
    '김준호 기자', '이서연 기자', '박민수 기자', '최지원 기자', '정태영 기자',
    'Sarah Johnson', 'Michael Chen', 'Dr. Robert Kim', 'Emma Williams', 'David Park',
    '한국로봇신문', '테크리뷰팀', 'AI 전문기자', '산업부', '국제부'
  ],
  sources: [
    'Reuters', 'Bloomberg', 'TechCrunch', 'IEEE Spectrum', 'MIT Technology Review',
    'The Verge', 'Wired', 'Forbes', 'Financial Times', 'Wall Street Journal',
    '조선일보', '한국경제', '전자신문', 'ZDNet Korea', 'Robotics Business Review'
  ],
  imageUrls: [
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1561144257-e32e8efc6c4f?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1563207153-f403bf289096?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1518314916381-77a37c2a49ae?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1516192518150-0d8fee5425e3?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1567427018141-0584cfcbf1b8?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop'
  ],
  tags: {
    news: ['속보', '신제품', '투자', '인수합병', '신기술', '발표'],
    'tech-review': ['리뷰', '성능분석', '비교', '테스트', '벤치마크'],
    'company-update': ['실적발표', '신규사업', '파트너십', '확장', '전략'],
    research: ['논문', '연구개발', '특허', '학술', '혁신기술'],
    innovation: ['혁신', '미래기술', '신개념', 'AI융합', '특허기술']
  } as Record<ArticleCategory, string[]>
};

// 추가 목 데이터 생성 함수
const generateMockArticles = (page: number): Article[] => {
  return Array.from({ length: 10 }, (_, index) => {
    // 타임스탬프와 페이지, 인덱스를 조합하여 완전히 고유한 ID 생성
    const uniqueId = `${Date.now()}-${page}-${index}-${Math.random().toString(36).substr(2, 9)}`;
    const displayId = page * 10 + index + 1000; // 표시용 ID
    const category = ['news', 'tech-review', 'company-update', 'research'][index % 4] as ArticleCategory;
    const titleIndex = displayId % robotNewsData.titles.length;
    const timeDiff = displayId < 20 ? displayId * 3 : displayId * 12; // 초반엔 시간 간격 짧게, 후반엔 길게
    
    return {
      id: `generated-${uniqueId}`, // 타임스탬프 기반 완전히 고유한 ID
      title: robotNewsData.titles[titleIndex],
      content: `${robotNewsData.titles[titleIndex]}에 대한 상세한 내용입니다. ${robotNewsData.excerpts[index % robotNewsData.excerpts.length]}...`,
      excerpt: robotNewsData.excerpts[index % robotNewsData.excerpts.length],
      imageUrl: robotNewsData.imageUrls[index % robotNewsData.imageUrls.length],
      author: robotNewsData.authors[displayId % robotNewsData.authors.length],
      source: robotNewsData.sources[displayId % robotNewsData.sources.length],
      publishedAt: new Date(Date.now() - timeDiff * 60 * 60 * 1000),
      category,
      tags: [
        ...robotNewsData.tags[category].slice(0, 2),
        '로봇',
        robotNewsData.titles[titleIndex].split(' ')[0].replace(',', '')
      ],
      viewCount: Math.floor(Math.random() * 15000) + 500,
      likeCount: Math.floor(Math.random() * 1000) + 50,
      commentCount: Math.floor(Math.random() * 200) + 5,
      isBookmarked: Math.random() > 0.85,
    };
  });
};

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const isInitialLoadExecuted = useRef(false);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const loadMoreArticles = useCallback(async () => {
    if (isLoading || !hasMore) return;

    console.log('[loadMoreArticles] 시작 - page:', page, 'isInitialLoading:', isInitialLoading);
    setIsLoading(true);
    
    try {
      // 초기 로딩은 즉시 실행, 추가 로딩만 지연
      if (isInitialLoading) {
        const newArticles = generateMockArticles(page);
        console.log('[loadMoreArticles] 초기 기사 생성:', newArticles.length);
        
        setArticles(prev => [...prev, ...newArticles]);
        setPage(prev => prev + 1);
        
        if (page >= 4) {
          setHasMore(false);
        }
        
        setIsLoading(false);
        setIsInitialLoading(false);
      } else {
        // 추가 로딩은 지연 시뮬레이션
        // 이전 타임아웃 정리
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
        }
        
        loadingTimeoutRef.current = setTimeout(() => {
          const newArticles = generateMockArticles(page);
          console.log('[loadMoreArticles] 추가 기사 생성:', newArticles.length);
          
          setArticles(prev => [...prev, ...newArticles]);
          setPage(prev => prev + 1);
          
          // 5페이지 이후로는 더 이상 로드하지 않음
          if (page >= 4) {
            setHasMore(false);
          }
          
          setIsLoading(false);
        }, 1000); // 1초 지연으로 로딩 시뮬레이션
      }
    } catch (error) {
      console.error('[loadMoreArticles] 에러 발생:', error);
      setIsLoading(false);
      setIsInitialLoading(false);
    }
  }, [page, isLoading, hasMore, isInitialLoading]);

  // 컴포넌트 마운트 시 초기 데이터 로드
  useEffect(() => {
    console.log('[useEffect] 마운트 - isInitialLoadExecuted:', isInitialLoadExecuted.current);
    
    // React StrictMode에서 중복 실행 방지
    if (!isInitialLoadExecuted.current) {
      isInitialLoadExecuted.current = true;
      console.log('[useEffect] 초기 로드 실행');
      loadMoreArticles();
    }

    // Cleanup 함수
    return () => {
      console.log('[useEffect] cleanup 실행');
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 렌더링 시점 상태 확인
  console.log('[render] 상태 - isInitialLoading:', isInitialLoading, 'articles:', articles.length);

  return (
    <>
      {/* 메인 콘텐츠 */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 메인 피드 */}
          <div className="lg:col-span-3">
            {isInitialLoading ? (
              // 초기 로딩 상태
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                  <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, index) => (
                    <div key={`home-skeleton-${index}`} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                      <div className="h-48 bg-gray-200 animate-pulse" />
                      <div className="p-6 space-y-4">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                        <div className="space-y-2">
                          <div className="h-3 bg-gray-200 rounded animate-pulse" />
                          <div className="h-3 bg-gray-200 rounded animate-pulse w-5/6" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <MainFeed 
                initialArticles={articles}
                onLoadMore={loadMoreArticles}
                isLoading={isLoading}
                hasMore={hasMore}
              />
            )}
          </div>
          
          {/* 사이드바 */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Sidebar />
            </div>
          </div>
        </div>
      </main>
      
      {/* 푸터 */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="text-2xl font-bold text-blue-600">🤖</div>
                <span className="text-xl font-bold text-gray-900">Robovers</span>
              </div>
              <p className="text-gray-600 mb-4">
                휴머노이드 로봇의 미래를 함께 탐험하는 플랫폼입니다. 
                최신 로봇 기술 동향부터 커뮤니티 토론까지 모든 것을 한 곳에서 만나보세요.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">플랫폼</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="/robots" className="hover:text-blue-600 transition-colors">로봇 정보</a></li>
                <li><a href="/community" className="hover:text-blue-600 transition-colors">커뮤니티</a></li>
                <li><a href="/companies" className="hover:text-blue-600 transition-colors">기업 & 주가</a></li>
                <li><a href="/news" className="hover:text-blue-600 transition-colors">뉴스</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">고객지원</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="/help" className="hover:text-blue-600 transition-colors">도움말</a></li>
                <li><a href="/contact" className="hover:text-blue-600 transition-colors">문의하기</a></li>
                <li><a href="/privacy" className="hover:text-blue-600 transition-colors">개인정보처리방침</a></li>
                <li><a href="/terms" className="hover:text-blue-600 transition-colors">이용약관</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-500">
            © 2024 Robovers. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  )
}