import { CommunityPost, User, Company, Comment, StockPriceHistory } from './types';

// 캐시된 더미 데이터
let cachedUsers: User[] | null = null;
let cachedPosts: CommunityPost[] | null = null;
let cachedCompanies: Company[] | null = null;

// 더미 사용자 데이터
const generateDummyUsers = (): User[] => [
  {
    id: '1',
    username: 'robotmaster',
    email: 'robotmaster@example.com',
    avatar: '',
    isVerified: true,
    joinedAt: new Date('2023-01-15'),
  },
  {
    id: '2',
    username: '테크마니아',
    email: 'techmania@example.com',
    avatar: '',
    isVerified: false,
    joinedAt: new Date('2023-06-20'),
  },
  {
    id: '3',
    username: 'AI연구원',
    email: 'airesearcher@example.com',
    avatar: '',
    isVerified: true,
    joinedAt: new Date('2023-03-10'),
  },
  {
    id: '4',
    username: '로봇공학도',
    email: 'roboteng@example.com',
    avatar: '',
    isVerified: false,
    joinedAt: new Date('2023-09-01'),
  },
  {
    id: '5',
    username: '미래기술',
    email: 'futuretech@example.com',
    avatar: '',
    isVerified: true,
    joinedAt: new Date('2023-02-28'),
  },
];

// 더미 커뮤니티 게시글 데이터
const generateDummyPosts = (): CommunityPost[] => [
  {
    id: '1',
    title: '테슬라 옵티머스 2세대 발표! 이전 모델 대비 놀라운 개선점',
    content: '테슬라가 옵티머스 2세대를 발표했습니다. 이전 모델 대비 보행 속도가 30% 향상되었고, 손가락 움직임이 더욱 정교해졌습니다. 특히 물체를 잡고 조작하는 능력이 크게 개선되어 실제 작업 환경에서의 활용 가능성이 높아졌습니다. 가격은 아직 미정이지만, 대량 생산이 시작되면 2만 달러 이하로 낮출 수 있을 것으로 예상됩니다.',
    author: generateDummyUsers()[0]!,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2시간 전
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    category: 'technical',
    tags: ['테슬라', '옵티머스', '휴머노이드'],
    viewCount: 1542,
    likeCount: 234,
    commentCount: 45,
    isLiked: true,
    isPinned: true,
  },
  {
    id: '2',
    title: '보스턴 다이나믹스 아틀라스 vs 현대 DAL-e, 어떤 로봇이 더 뛰어날까?',
    content: '두 휴머노이드 로봇의 성능을 비교해봤습니다. 아틀라스는 운동 능력과 균형 감각에서 앞서고, DAL-e는 실용성과 비용 효율성에서 우위를 보입니다. 각각의 장단점을 자세히 분석해보겠습니다...',
    author: generateDummyUsers()[1]!,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5시간 전
    updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    category: 'discussion',
    tags: ['보스턴다이나믹스', '현대', '비교분석'],
    viewCount: 892,
    likeCount: 156,
    commentCount: 67,
    isLiked: false,
    isPinned: false,
  },
  {
    id: '3',
    title: '휴머노이드 로봇 개발 시 고려해야 할 윤리적 문제들',
    content: '휴머노이드 로봇이 일상생활에 깊숙이 들어오면서 우리가 고민해야 할 윤리적 문제들이 있습니다. 프라이버시, 일자리 대체, 인간과의 관계 등 다양한 측면에서 논의가 필요합니다.',
    author: generateDummyUsers()[2]!,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1일 전
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    category: 'discussion',
    tags: ['윤리', 'AI', '미래사회'],
    viewCount: 567,
    likeCount: 89,
    commentCount: 34,
    isLiked: false,
    isPinned: false,
  },
  {
    id: '4',
    title: '초보자를 위한 ROS2 휴머노이드 로봇 프로그래밍 가이드',
    content: 'ROS2를 사용해서 휴머노이드 로봇을 프로그래밍하는 방법을 단계별로 설명합니다. 환경 설정부터 간단한 모션 제어까지 다룹니다.',
    author: generateDummyUsers()[3]!,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2일 전
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    category: 'technical',
    tags: ['ROS2', '프로그래밍', '튜토리얼'],
    viewCount: 1234,
    likeCount: 201,
    commentCount: 56,
    isLiked: true,
    isPinned: false,
  },
  {
    id: '5',
    title: 'Figure 01 로봇이 BMW 공장에서 일하는 모습 공개!',
    content: 'Figure AI의 휴머노이드 로봇이 실제 BMW 제조 공장에서 작업하는 영상이 공개되었습니다. 부품 조립과 품질 검사를 수행하는 모습이 인상적입니다.',
    author: generateDummyUsers()[4]!,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3일 전
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    category: 'showcase',
    tags: ['Figure', 'BMW', '산업용로봇'],
    viewCount: 2156,
    likeCount: 345,
    commentCount: 78,
    isLiked: false,
    isPinned: false,
  },
  {
    id: '6',
    title: '휴머노이드 로봇의 배터리 수명을 2배로 늘리는 방법은?',
    content: '최신 배터리 기술과 에너지 효율적인 모터 제어 알고리즘을 통해 휴머노이드 로봇의 작동 시간을 크게 늘릴 수 있습니다. 실제 연구 결과를 바탕으로 설명드립니다.',
    author: generateDummyUsers()[0]!,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4일 전
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    category: 'technical',
    tags: ['배터리', '에너지효율', '연구'],
    viewCount: 789,
    likeCount: 123,
    commentCount: 23,
    isLiked: false,
    isPinned: false,
  },
  {
    id: '7',
    title: '가정용 휴머노이드 로봇, 언제쯤 우리 집에 들어올까?',
    content: '현재 기술 발전 속도와 가격 하락 추세를 고려하면, 5-10년 내에 일반 가정에서도 휴머노이드 로봇을 볼 수 있을 것으로 예상됩니다. 주요 기업들의 로드맵을 살펴보면...',
    author: generateDummyUsers()[1]!,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5일 전
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    category: 'general',
    tags: ['미래예측', '가정용로봇', '시장전망'],
    viewCount: 1567,
    likeCount: 267,
    commentCount: 89,
    isLiked: true,
    isPinned: false,
  },
  {
    id: '8',
    title: 'OpenAI가 로봇 분야에 재진출한다면? GPT와 로봇의 결합',
    content: 'OpenAI가 다시 로봇 분야에 뛰어든다면 어떤 일이 일어날까요? GPT 기술과 휴머노이드 로봇의 결합은 놀라운 시너지를 만들어낼 수 있습니다.',
    author: generateDummyUsers()[2]!,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6일 전
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    category: 'discussion',
    tags: ['OpenAI', 'GPT', 'AI로봇'],
    viewCount: 2345,
    likeCount: 456,
    commentCount: 123,
    isLiked: false,
    isPinned: false,
  },
  {
    id: '9',
    title: '휴머노이드 로봇 스타트업에 투자하기 전 꼭 확인해야 할 5가지',
    content: '로봇 분야 투자를 고려하고 계신가요? 기술력, 시장성, 팀 구성, 특허, 파트너십 등 투자 전 반드시 검토해야 할 핵심 요소들을 정리했습니다.',
    author: generateDummyUsers()[3]!,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7일 전
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    category: 'general',
    tags: ['투자', '스타트업', '체크리스트'],
    viewCount: 890,
    likeCount: 145,
    commentCount: 34,
    isLiked: false,
    isPinned: false,
  },
  {
    id: '10',
    title: '중국 유니트리 G1 로봇 실물 리뷰 - 가성비 최강 휴머노이드?',
    content: '16,000달러라는 파격적인 가격의 유니트리 G1을 직접 사용해본 후기입니다. 가격 대비 성능은 확실히 뛰어나지만, 몇 가지 아쉬운 점도 있었습니다.',
    author: generateDummyUsers()[4]!,
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8일 전
    updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    category: 'showcase',
    tags: ['유니트리', 'G1', '리뷰'],
    viewCount: 3456,
    likeCount: 567,
    commentCount: 234,
    isLiked: true,
    isPinned: false,
  },
  {
    id: '11',
    title: '로봇 관절 모터 선택 가이드 - 서보 vs 스테퍼 vs BLDC',
    content: '휴머노이드 로봇 개발 시 가장 중요한 부품 중 하나인 모터. 각 모터 타입의 장단점과 적용 사례를 상세히 비교해보겠습니다.',
    author: generateDummyUsers()[0]!,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10일 전
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    category: 'technical',
    tags: ['모터', '하드웨어', '가이드'],
    viewCount: 1234,
    likeCount: 234,
    commentCount: 67,
    isLiked: false,
    isPinned: false,
  },
  {
    id: '12',
    title: '휴머노이드 로봇이 의료 현장에서 간호사를 도울 수 있을까?',
    content: '고령화 사회에서 의료 인력 부족 문제를 해결할 수 있는 대안으로 휴머노이드 로봇이 주목받고 있습니다. 실제 적용 가능성과 한계점을 살펴봅니다.',
    author: generateDummyUsers()[1]!,
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12일 전
    updatedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    category: 'question',
    tags: ['의료', '간호', '미래직업'],
    viewCount: 567,
    likeCount: 89,
    commentCount: 45,
    isLiked: false,
    isPinned: false,
  },
];

export function getDummyPosts(): CommunityPost[] {
  if (!cachedPosts) {
    cachedPosts = generateDummyPosts();
  }
  return [...cachedPosts];
}

export function getDummyPostById(id: string): CommunityPost | undefined {
  return getDummyPosts().find(post => post.id === id);
}

export function getDummyUsers(): User[] {
  if (!cachedUsers) {
    cachedUsers = generateDummyUsers();
  }
  return [...cachedUsers];
}

// 더미 기업 데이터
const generateDummyCompanies = (): Company[] => [
  {
    id: '1',
    name: 'Tesla',
    symbol: 'TSLA',
    currentPrice: 245.32,
    changePercent: 2.45,
    changeAmount: 5.87,
    logoUrl: 'https://logo.clearbit.com/tesla.com',
    marketCap: 779000000000,
    description: '전기차 제조업체로 Optimus 휴머노이드 로봇을 개발하고 있습니다.',
    foundedYear: 2003,
    country: '미국',
    employeeCount: 127855,
    isPublic: true,
    mainProducts: ['전기차', '에너지 저장 시스템', '태양광 패널'],
    robotProjects: ['Optimus', 'Tesla Bot'],
    website: 'https://tesla.com',
    sector: 'automotive'
  },
  {
    id: '2',
    name: 'Boston Dynamics',
    symbol: 'PRIVATE',
    currentPrice: 0,
    changePercent: 0,
    changeAmount: 0,
    logoUrl: 'https://logo.clearbit.com/bostondynamics.com',
    marketCap: 1100000000,
    description: '세계 최고의 로봇 공학 회사로 Atlas, Spot 등을 개발했습니다.',
    foundedYear: 1992,
    country: '미국',
    employeeCount: 500,
    isPublic: false,
    mainProducts: ['Atlas', 'Spot', 'Stretch', 'Pick'],
    robotProjects: ['Atlas', 'Handle'],
    website: 'https://bostondynamics.com',
    sector: 'robotics'
  },
  {
    id: '3',
    name: 'Figure AI',
    symbol: 'PRIVATE',
    currentPrice: 0,
    changePercent: 0,
    changeAmount: 0,
    logoUrl: 'https://logo.clearbit.com/figure.ai',
    marketCap: 2600000000,
    description: '범용 휴머노이드 로봇을 개발하는 AI 로봇 스타트업입니다.',
    foundedYear: 2022,
    country: '미국',
    employeeCount: 80,
    isPublic: false,
    mainProducts: ['Figure 01'],
    robotProjects: ['Figure 01', 'Figure 02'],
    website: 'https://figure.ai',
    sector: 'robotics'
  },
  {
    id: '4',
    name: 'Agility Robotics',
    symbol: 'PRIVATE',
    currentPrice: 0,
    changePercent: 0,
    changeAmount: 0,
    logoUrl: 'https://logo.clearbit.com/agilityrobotics.com',
    marketCap: 150000000,
    description: '물류 자동화를 위한 Digit 휴머노이드 로봇을 개발합니다.',
    foundedYear: 2015,
    country: '미국',
    employeeCount: 200,
    isPublic: false,
    mainProducts: ['Digit', 'Cassie'],
    robotProjects: ['Digit V2', 'Digit V3'],
    website: 'https://agilityrobotics.com',
    sector: 'robotics'
  },
  {
    id: '5',
    name: '현대자동차',
    symbol: '005380.KS',
    currentPrice: 189500,
    changePercent: -0.58,
    changeAmount: -1100,
    logoUrl: 'https://logo.clearbit.com/hyundai.com',
    marketCap: 40400000000000,
    description: '보스턴 다이나믹스를 인수하고 DAL-e 등 로봇을 개발하는 자동차 제조사입니다.',
    foundedYear: 1967,
    country: '한국',
    employeeCount: 75000,
    isPublic: true,
    mainProducts: ['자동차', '로봇', '모빌리티'],
    robotProjects: ['DAL-e', 'Factory Safety Service Robot'],
    website: 'https://hyundai.com',
    sector: 'automotive'
  },
  {
    id: '6',
    name: 'Unitree Robotics',
    symbol: 'PRIVATE',
    currentPrice: 0,
    changePercent: 0,
    changeAmount: 0,
    logoUrl: 'https://logo.clearbit.com/unitree.com',
    marketCap: 1500000000,
    description: '중국의 선도적인 로봇 제조업체로 H1, G1 등을 개발합니다.',
    foundedYear: 2017,
    country: '중국',
    employeeCount: 300,
    isPublic: false,
    mainProducts: ['H1', 'G1', 'Go2', 'B2'],
    robotProjects: ['H1', 'G1'],
    website: 'https://unitree.com',
    sector: 'robotics'
  },
  {
    id: '7',
    name: '1X Technologies',
    symbol: 'PRIVATE',
    currentPrice: 0,
    changePercent: 0,
    changeAmount: 0,
    logoUrl: 'https://logo.clearbit.com/1x.tech',
    marketCap: 100000000,
    description: '노르웨이의 휴머노이드 로봇 스타트업으로 EVE 로봇을 개발합니다.',
    foundedYear: 2014,
    country: '노르웨이',
    employeeCount: 60,
    isPublic: false,
    mainProducts: ['EVE', 'NEO'],
    robotProjects: ['EVE', 'NEO Beta'],
    website: 'https://1x.tech',
    sector: 'robotics'
  },
  {
    id: '8',
    name: 'SoftBank Robotics',
    symbol: '9984.T',
    currentPrice: 1659,
    changePercent: 1.22,
    changeAmount: 20,
    logoUrl: 'https://logo.clearbit.com/softbankrobotics.com',
    marketCap: 7800000000000,
    description: 'Pepper와 NAO 로봇을 개발하는 일본의 로봇 회사입니다.',
    foundedYear: 2005,
    country: '일본',
    employeeCount: 600,
    isPublic: true,
    mainProducts: ['Pepper', 'NAO', 'Whiz'],
    robotProjects: ['Pepper 2.0', 'NAO Evolution'],
    website: 'https://softbankrobotics.com',
    sector: 'robotics'
  },
  {
    id: '9',
    name: 'Amazon',
    symbol: 'AMZN',
    currentPrice: 178.45,
    changePercent: 3.12,
    changeAmount: 5.40,
    logoUrl: 'https://logo.clearbit.com/amazon.com',
    marketCap: 1850000000000,
    description: '물류 자동화를 위한 로봇 기술에 큰 투자를 하고 있는 이커머스 대기업입니다.',
    foundedYear: 1994,
    country: '미국',
    employeeCount: 1541000,
    isPublic: true,
    mainProducts: ['이커머스', 'AWS', '물류 로봇'],
    robotProjects: ['Sparrow', 'Proteus', 'Digit (파트너십)'],
    website: 'https://amazon.com',
    sector: 'technology'
  },
  {
    id: '10',
    name: 'Xiaomi',
    symbol: '1810.HK',
    currentPrice: 16.82,
    changePercent: -1.75,
    changeAmount: -0.30,
    logoUrl: 'https://logo.clearbit.com/xiaomi.com',
    marketCap: 420000000000,
    description: 'CyberOne 휴머노이드 로봇을 개발하는 중국의 전자제품 제조사입니다.',
    foundedYear: 2010,
    country: '중국',
    employeeCount: 35314,
    isPublic: true,
    mainProducts: ['스마트폰', 'IoT 기기', '가전제품'],
    robotProjects: ['CyberOne', 'CyberDog'],
    website: 'https://xiaomi.com',
    sector: 'technology'
  }
];

export function getDummyCompanies(): Company[] {
  if (!cachedCompanies) {
    cachedCompanies = generateDummyCompanies();
  }
  return [...cachedCompanies];
}

export function getDummyCompanyById(id: string): Company | undefined {
  return getDummyCompanies().find(company => company.id === id);
}

// 더미 주가 히스토리 데이터 생성
export function getDummyStockHistory(companyId: string, timeRange: '1M' | '3M' | '6M' | '1Y' | 'ALL'): StockPriceHistory[] {
  const company = getDummyCompanyById(companyId);
  if (!company || !company.isPublic || !company.currentPrice) {
    return [];
  }

  const basePrice = company.currentPrice;
  const volatility = 0.02; // 2% 일일 변동성
  const trend = company.changePercent > 0 ? 0.0002 : -0.0002; // 약간의 추세
  
  // 기간별 데이터 포인트 수
  const dataPoints = {
    '1M': 30,
    '3M': 90,
    '6M': 180,
    '1Y': 365,
    'ALL': 730
  };

  const points = dataPoints[timeRange];
  const history: StockPriceHistory[] = [];
  
  let currentPrice = basePrice;
  const now = new Date();

  for (let i = points; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // 랜덤 변동 + 추세
    const randomChange = (Math.random() - 0.5) * volatility;
    const trendChange = trend;
    currentPrice = currentPrice * (1 + randomChange + trendChange);
    
    // 주말 제외 (간단한 구현)
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      history.push({
        date: date,
        price: Math.max(currentPrice, 1), // 최소 가격 $1
        volume: Math.floor(Math.random() * 10000000) + 1000000, // 1M ~ 11M
      });
    }
  }

  // 마지막 값을 현재 가격으로 조정
  if (history.length > 0) {
    history[history.length - 1].price = basePrice;
  }

  return history;
}

// 더미 댓글 데이터
const generateDummyComments = (postId: string): Comment[] => {
  const baseComments: Omit<Comment, 'id' | 'createdAt'>[] = [
    {
      content: '정말 흥미로운 내용이네요! Tesla의 Optimus가 실제로 상용화되면 우리 생활이 많이 바뀔 것 같아요.',
      author: generateDummyUsers()[1]!,
      likeCount: 12,
      isLiked: false,
    },
    {
      content: '기술적으로 아직 해결해야 할 과제들이 많을 것 같은데, 특히 배터리 지속시간과 안전성 부분이 중요할 것 같습니다.',
      author: generateDummyUsers()[2]!,
      likeCount: 8,
      isLiked: true,
    },
    {
      content: '가격이 정말 중요한 요소인 것 같아요. 2만 달러면 일반 가정에서도 구매할 수 있는 수준이네요.',
      author: generateDummyUsers()[3]!,
      likeCount: 15,
      isLiked: false,
    },
    {
      content: '보스턴 다이나믹스의 Atlas와 비교했을 때 어떤 장단점이 있을까요?',
      author: generateDummyUsers()[4]!,
      likeCount: 5,
      isLiked: false,
    },
    {
      content: '휴머노이드 로봇의 윤리적 문제도 함께 논의되어야 할 것 같습니다. 일자리 대체 문제 등...',
      author: generateDummyUsers()[0]!,
      likeCount: 23,
      isLiked: true,
    },
  ];

  const replies: Omit<Comment, 'id' | 'createdAt'>[] = [
    {
      content: '맞습니다! 특히 제조업에서의 활용도가 높을 것 같아요.',
      author: generateDummyUsers()[0]!,
      likeCount: 3,
      isLiked: false,
    },
    {
      content: '안전성 문제는 정말 중요하죠. ISO 표준 같은 것들이 필요할 것 같아요.',
      author: generateDummyUsers()[1]!,
      likeCount: 7,
      isLiked: false,
    },
    {
      content: 'Atlas는 운동성능이, Optimus는 실용성이 더 좋은 것 같아요.',
      author: generateDummyUsers()[2]!,
      likeCount: 4,
      isLiked: true,
    },
  ];

  // 메인 댓글들 생성
  const comments: Comment[] = baseComments.map((comment, index) => ({
    ...comment,
    id: `comment-${postId}-${index + 1}`,
    createdAt: new Date(Date.now() - (index + 1) * 2 * 60 * 60 * 1000), // 2시간씩 차이
  }));

  // 첫 번째와 세 번째 댓글에 답글 추가
  comments[0].replies = [
    {
      ...replies[0],
      id: `reply-${postId}-1-1`,
      createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
      parentId: comments[0].id,
    },
  ];

  comments[2].replies = [
    {
      ...replies[1],
      id: `reply-${postId}-3-1`,
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      parentId: comments[2].id,
    },
    {
      ...replies[2],
      id: `reply-${postId}-3-2`,
      createdAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
      parentId: comments[2].id,
    },
  ];

  return comments;
};

export function getDummyComments(postId: string): Comment[] {
  return generateDummyComments(postId);
}

// 어드민 페이지용 댓글 데이터 생성
interface AdminComment extends Comment {
  postId: string;
  postTitle: string;
  status: 'visible' | 'hidden' | 'reported';
  reportCount?: number;
}

// 캐시된 어드민 댓글 데이터
let cachedAdminComments: AdminComment[] | null = null;

export function getDummyCommentsForAdmin() {
  if (cachedAdminComments) {
    return cachedAdminComments;
  }
  
  const posts = getDummyPosts();
  const adminComments: AdminComment[] = [];
  
  // 각 포스트별로 댓글 생성
  posts.forEach((post, _postIndex) => {
    const comments = generateDummyComments(post.id);
    
    comments.forEach((comment, _commentIndex) => {
      // 상태 랜덤 배정
      const statuses: ('visible' | 'hidden' | 'reported')[] = ['visible', 'visible', 'visible', 'visible', 'hidden', 'reported'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      adminComments.push({
        ...comment,
        postId: post.id,
        postTitle: post.title,
        status: randomStatus,
        reportCount: randomStatus === 'reported' ? Math.floor(Math.random() * 10) + 1 : 0,
      });
      
      // 답글도 추가
      if (comment.replies) {
        comment.replies.forEach(reply => {
          const replyStatus = statuses[Math.floor(Math.random() * statuses.length)];
          adminComments.push({
            ...reply,
            postId: post.id,
            postTitle: post.title,
            status: replyStatus,
            reportCount: replyStatus === 'reported' ? Math.floor(Math.random() * 5) + 1 : 0,
            parentId: comment.id,
          });
        });
      }
    });
  });
  
  // 추가 더미 댓글 생성 (더 많은 데이터를 위해)
  const additionalComments = [
    '이 기능 정말 유용하네요!',
    '더 자세한 설명이 필요할 것 같습니다.',
    '오류가 발생하는데 해결 방법이 있을까요?',
    '좋은 정보 감사합니다.',
    '다른 의견도 들어보고 싶네요.',
    '이 부분은 조금 다르게 생각합니다.',
    '실제로 적용해보니 잘 작동합니다!',
    '추가 자료 있으면 공유 부탁드려요.',
    '비슷한 경험이 있어서 공감됩니다.',
    '더 많은 사람들이 알았으면 좋겠어요.'
  ];
  
  // 최근 30일 내의 랜덤 날짜 생성
  const getRandomRecentDate = () => {
    const now = new Date();
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    date.setHours(Math.floor(Math.random() * 24));
    date.setMinutes(Math.floor(Math.random() * 60));
    return date;
  };
  
  // 추가 댓글 50개 생성
  for (let i = 0; i < 50; i++) {
    const randomPost = posts[Math.floor(Math.random() * posts.length)];
    const users = getDummyUsers();
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomContent = additionalComments[Math.floor(Math.random() * additionalComments.length)];
    const statuses: ('visible' | 'hidden' | 'reported')[] = ['visible', 'visible', 'visible', 'visible', 'hidden', 'reported'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    adminComments.push({
      id: `extra-comment-${i}`,
      content: randomContent,
      author: randomUser,
      createdAt: getRandomRecentDate(),
      likeCount: Math.floor(Math.random() * 50),
      isLiked: Math.random() > 0.7,
      postId: randomPost?.id || 'unknown',
      postTitle: randomPost?.title || 'Unknown Post',
      status: randomStatus,
      reportCount: randomStatus === 'reported' ? Math.floor(Math.random() * 15) + 1 : 0,
    });
  }
  
  cachedAdminComments = adminComments;
  return adminComments;
}

// 캐시 초기화 함수 (필요시 사용)
export function clearDummyDataCache() {
  cachedUsers = null;
  cachedPosts = null;
  cachedCompanies = null;
  cachedAdminComments = null;
}