# Robovers Frontend

휴머노이드 로봇 정보 공유 플랫폼의 프론트엔드 애플리케이션입니다.

## 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: Zustand + TanStack Query
- **Form Handling**: React Hook Form
- **Testing**: Jest + React Testing Library

## 개발 환경 설정

### 필수 요구사항

- Node.js 18+
- PNPM 8+

### 설치 및 실행

```bash
# 의존성 설치 (루트 디렉토리에서)
pnpm install

# 개발 서버 실행
pnpm dev

# 프로덕션 빌드
pnpm build

# 프로덕션 서버 실행
pnpm start
```

개발 서버는 `http://localhost:4000`에서 실행됩니다.

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── (routes)/          # 라우트 그룹
│   ├── admin/             # 관리자 페이지
│   └── globals.css        # 전역 스타일
├── components/
│   ├── ui/               # 재사용 가능한 UI 컴포넌트
│   ├── auth/             # 인증 관련 컴포넌트
│   ├── community/        # 커뮤니티 기능
│   ├── robot/            # 로봇 정보 관련
│   └── layout/           # 레이아웃 컴포넌트
├── hooks/                # 커스텀 React 훅
├── lib/
│   ├── api/             # API 클라이언트
│   ├── types.ts         # TypeScript 타입 정의
│   └── utils.ts         # 유틸리티 함수
└── stores/              # Zustand 상태 관리
```

## 주요 기능

- 사용자 인증 (회원가입, 로그인, 프로필 관리)
- 로봇 정보 검색 및 상세 보기
- 커뮤니티 (게시글, 댓글, 좋아요)
- 회사 정보 및 주가 차트
- 관리자 대시보드

## 테스트

```bash
# 단위 테스트 실행
pnpm test

# 테스트 감시 모드
pnpm test:watch

# 테스트 커버리지
pnpm test:coverage
```

## 환경 변수

프로덕션 환경에서는 다음 환경 변수가 필요합니다:

- `NEXT_PUBLIC_API_URL`: 백엔드 API URL