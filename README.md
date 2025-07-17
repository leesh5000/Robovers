# 🤖 Robovers - 휴머노이드 로봇 정보 공유 플랫폼

## 📋 프로젝트 소개

Robovers는 휴머노이드 로봇에 대한 지식을 공유하고, 발전 현황을 추적하며, 관련 기업의 미래 전망과 실시간 주가 정보를 제공하는 종합 정보 플랫폼입니다.

## 🚀 주요 기능

- **커뮤니티**: 사용자 간 로봇 관련 지식 공유 및 토론
- **로봇 정보**: 최신 휴머노이드 로봇 정보, 사양, 비교
- **기업 정보**: 로봇 관련 기업의 현황 및 미래 전망
- **실시간 주가**: 관련 기업들의 실시간 주가 정보 및 차트
- **뉴스 & 동향**: 최신 로봇 산업 뉴스 및 기술 동향

## 🏗️ 기술 스택

### Backend
- **Framework**: NestJS + TypeScript
- **Database**: PostgreSQL (Prisma ORM)
- **Cache**: Redis
- **Real-time**: Socket.io
- **Queue**: Bull
- **Architecture**: Hexagonal Architecture

### Frontend
- **Framework**: Next.js 14 + TypeScript
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query + Zustand
- **Animation**: Framer Motion
- **Charts**: Chart.js

### DevOps
- **Container**: Docker + Docker Compose
- **Package Manager**: PNPM (Monorepo)
- **Testing**: Jest + Testing Library
- **CI/CD**: GitHub Actions

## 📁 프로젝트 구조

```
robovers/
├── backend/          # NestJS 백엔드 애플리케이션
├── frontend/         # Next.js 프론트엔드 애플리케이션
├── shared/           # 공유 타입 및 유틸리티
└── docker/           # Docker 설정 파일
```

## 🚀 시작하기

### 필수 요구사항

- Node.js 18.0.0 이상
- PNPM 8.0.0 이상
- Docker & Docker Compose
- PostgreSQL 15 이상

### 설치 및 실행

```bash
# 의존성 설치
pnpm install

# 개발 환경 실행
pnpm dev

# 프로덕션 빌드
pnpm build

# 테스트 실행
pnpm test

# 린팅
pnpm lint
```

### Docker 환경 실행

```bash
# Docker 컨테이너 시작
docker-compose up -d

# Docker 컨테이너 중지
docker-compose down
```

## 🧪 개발 방법론

이 프로젝트는 다음 개발 방법론을 따릅니다:

- **TDD (Test-Driven Development)**: 테스트 우선 개발
- **Hexagonal Architecture**: 도메인 중심 설계
- **Clean Code**: 깨끗하고 유지보수 가능한 코드
- **Atomic Commits**: 논리적 단위별 커밋

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.

## 👥 기여하기

기여를 환영합니다! PR을 제출하기 전에 다음 사항을 확인해주세요:

1. 코드 스타일 가이드 준수
2. 모든 테스트 통과
3. 적절한 문서화
4. 커밋 메시지 컨벤션 준수