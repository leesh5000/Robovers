import apiClient from './client';

export type PostCategory = 'NEWS' | 'DISCUSSION' | 'QUESTION' | 'TUTORIAL' | 'REVIEW' | 'ANALYSIS';

export interface Author {
  id: string;
  nickname: string;
  profileImageUrl?: string;
}

export interface RelatedRobot {
  id: string;
  name: string;
  manufacturer: string;
  imageUrl?: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  category: PostCategory;
  viewCount: number;
  likeCount: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  author: Author;
  robot?: RelatedRobot;
  sourceUrl?: string;
  sourceName?: string;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  author: Author;
  likeCount: number;
  createdAt: string;
  parentId?: string;
  replies?: Comment[];
}

// Mock data for development
const mockPost: Post = {
  id: '1',
  title: '테슬라 옵티머스 2세대 공개: 휴머노이드 로봇의 새로운 이정표',
  content: `# 테슬라 옵티머스 2세대 공개

테슬라가 최근 공개한 옵티머스 2세대 휴머노이드 로봇은 로봇 공학 분야에 새로운 이정표를 세웠습니다. 이번 발표에서 주목할 만한 개선사항들을 살펴보겠습니다.

## 주요 개선사항

### 1. 향상된 운동 능력
- **보행 속도**: 30% 향상된 보행 속도
- **균형 감각**: 더욱 자연스러운 움직임 구현
- **손재주**: 계란을 깨지 않고 다룰 수 있는 정밀한 그립력

### 2. 인공지능 업그레이드
옵티머스 2세대는 테슬라의 FSD(Full Self-Driving) 기술을 기반으로 한 AI를 탑재했습니다. 이를 통해:
- 실시간 환경 인식
- 자율적인 작업 계획 수립
- 인간과의 자연스러운 상호작용

### 3. 제조 비용 절감
일론 머스크는 대량 생산 시 2만 달러 이하로 제조 비용을 낮출 수 있다고 발표했습니다. 이는 휴머노이드 로봇의 대중화에 큰 걸음을 내딛은 것입니다.

## 활용 분야

옵티머스는 다음과 같은 분야에서 활용될 예정입니다:
- **제조업**: 반복적이고 위험한 작업 수행
- **의료**: 환자 보조 및 간호 지원
- **가정**: 일상적인 집안일 보조

## 경쟁사 대응

보스턴 다이내믹스, 어질리티 로보틱스 등 경쟁사들도 각자의 휴머노이드 로봇 개발에 박차를 가하고 있습니다. 특히 중국의 유니트리 로보틱스는 가격 경쟁력을 앞세워 시장 진입을 노리고 있습니다.

## 전망

전문가들은 2025년까지 휴머노이드 로봇 시장이 본격적으로 형성될 것으로 예상합니다. 테슬라의 옵티머스가 이 시장에서 어떤 위치를 차지할지 귀추가 주목됩니다.`,
  category: 'NEWS',
  viewCount: 1523,
  likeCount: 89,
  tags: ['테슬라', '옵티머스', '휴머노이드', 'AI', '로봇공학'],
  createdAt: '2024-01-18T10:30:00Z',
  updatedAt: '2024-01-18T10:30:00Z',
  author: {
    id: '1',
    nickname: 'tech_writer',
    profileImageUrl: undefined
  },
  robot: {
    id: '1',
    name: 'Tesla Optimus Gen 2',
    manufacturer: 'Tesla',
    imageUrl: undefined
  },
  sourceUrl: 'https://www.tesla.com/optimus',
  sourceName: 'Tesla Official'
};

const mockComments: Comment[] = [
  {
    id: '1',
    content: '정말 인상적인 발전이네요! 특히 손재주 부분이 놀랍습니다.',
    authorId: '2',
    author: {
      id: '2',
      nickname: 'robot_enthusiast',
      profileImageUrl: undefined
    },
    likeCount: 12,
    createdAt: '2024-01-18T11:00:00Z',
    replies: [
      {
        id: '2',
        content: '맞아요! 계란을 다룰 수 있다는 건 정말 정밀한 제어가 가능하다는 뜻이죠.',
        authorId: '3',
        author: {
          id: '3',
          nickname: 'ai_developer',
          profileImageUrl: undefined
        },
        likeCount: 5,
        createdAt: '2024-01-18T11:30:00Z',
        parentId: '1'
      }
    ]
  },
  {
    id: '3',
    content: '가격이 2만 달러라니... 정말 대중화가 가능할까요?',
    authorId: '4',
    author: {
      id: '4',
      nickname: 'skeptical_user',
      profileImageUrl: undefined
    },
    likeCount: 8,
    createdAt: '2024-01-18T12:00:00Z'
  }
];

export const postsApi = {
  // Get single post
  getPost: async (id: string): Promise<Post> => {
    // Mock implementation for now
    // Replace with actual API call: return apiClient.get<Post>(`/posts/${id}`).then(res => res.data);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockPost);
      }, 500);
    });
  },

  // Get post comments
  getComments: async (postId: string): Promise<Comment[]> => {
    // Mock implementation for now
    // Replace with actual API call: return apiClient.get<Comment[]>(`/posts/${postId}/comments`).then(res => res.data);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockComments);
      }, 500);
    });
  },

  // Like post
  likePost: async (postId: string): Promise<void> => {
    // Replace with actual API call: return apiClient.post(`/posts/${postId}/like`);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 200);
    });
  },

  // Add comment
  addComment: async (postId: string, content: string, parentId?: string): Promise<Comment> => {
    // Replace with actual API call
    const newComment: Comment = {
      id: Date.now().toString(),
      content,
      authorId: 'current-user',
      author: {
        id: 'current-user',
        nickname: 'current_user',
      },
      likeCount: 0,
      createdAt: new Date().toISOString(),
      parentId
    };
    return Promise.resolve(newComment);
  }
};