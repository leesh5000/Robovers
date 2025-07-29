import { getDummyPosts } from './dummy-data';
import { Comment, User } from './types';

interface AdminComment extends Comment {
  postId: string;
  postTitle: string;
  status: 'visible' | 'hidden' | 'reported';
  reportCount?: number;
}

// 더미 유저 데이터
const dummyUsers: User[] = [
  {
    id: 'user1',
    username: '김로봇',
    email: 'kim@example.com',
    avatar: 'https://i.pravatar.cc/150?u=kim',
    isVerified: true,
    joinedAt: new Date('2023-01-15'),
  },
  {
    id: 'user2',
    username: '이테크',
    email: 'lee@example.com',
    avatar: 'https://i.pravatar.cc/150?u=lee',
    isVerified: false,
    joinedAt: new Date('2023-06-20'),
  },
  {
    id: 'user3',
    username: '박휴먼',
    email: 'park@example.com',
    avatar: 'https://i.pravatar.cc/150?u=park',
    isVerified: true,
    joinedAt: new Date('2023-09-10'),
  },
  {
    id: 'user4',
    username: '최AI',
    email: 'choi@example.com',
    avatar: 'https://i.pravatar.cc/150?u=choi',
    isVerified: false,
    joinedAt: new Date('2023-12-01'),
  },
  {
    id: 'user5',
    username: '정로보',
    email: 'jung@example.com',
    avatar: 'https://i.pravatar.cc/150?u=jung',
    isVerified: true,
    joinedAt: new Date('2024-02-14'),
  },
];

// 어드민 페이지용 댓글 데이터 생성
export function getDummyCommentsForAdmin() {
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
          const replyStatus: ('visible' | 'hidden' | 'reported') = statuses[Math.floor(Math.random() * statuses.length)];
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
    const randomUser = dummyUsers[Math.floor(Math.random() * dummyUsers.length)];
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
      postId: randomPost.id,
      postTitle: randomPost.title,
      status: randomStatus,
      reportCount: randomStatus === 'reported' ? Math.floor(Math.random() * 15) + 1 : 0,
    });
  }
  
  return adminComments;
}

// 더미 댓글 생성 함수 (기존 코드에서 복사)
const generateDummyComments = (postId: string) => {
  const baseComments = [
    {
      id: `${postId}-comment-1`,
      content: '정말 흥미로운 내용이네요! Tesla의 Optimus가 실제로 상용화되면 우리 생활이 많이 바뀔 것 같아요.',
      author: dummyUsers[1],
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
      likeCount: 12,
      isLiked: false,
    },
    {
      id: `${postId}-comment-2`,
      content: '기술적으로 아직 해결해야 할 과제들이 많을 것 같은데, 특히 배터리 지속시간과 안전성 부분이 중요할 것 같습니다.',
      author: dummyUsers[2],
      createdAt: new Date(Date.now() - 1000 * 60 * 45),
      likeCount: 8,
      isLiked: true,
    },
  ];

  const replies = [
    {
      id: `${postId}-reply-1`,
      content: '맞습니다! 특히 제조업에서의 활용도가 높을 것 같아요.',
      author: dummyUsers[0],
      createdAt: new Date(Date.now() - 1000 * 60 * 20),
      likeCount: 3,
      isLiked: false,
      parentId: `${postId}-comment-1`,
    },
  ];

  return [
    ...baseComments.map(comment => ({
      ...comment,
      replies: replies.filter(reply => reply.parentId === comment.id),
    })),
  ];
};