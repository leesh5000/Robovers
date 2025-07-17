# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

**Robovers**는 휴머노이드 로봇 정보 공유 플랫폼입니다. 사용자들이 로봇에 대한 지식을 공유하고, 발전 현황을 추적하며, 관련 기업의 미래 전망과 실시간 주가 정보를 확인할 수 있는 종합 플랫폼입니다.

## 현재 상태

- **상태**: 기본 프로젝트 구조 완성
- **아키텍처**: 헥사고날 아키텍처 패턴 적용
- **개발 방법론**: 테스트 주도 개발(TDD) 방식
- **패키지 관리**: PNPM 워크스페이스 모노레포

## 기술 스택

### Backend (NestJS)
- **Framework**: NestJS + TypeScript
- **Database**: PostgreSQL (Prisma ORM)
- **Cache**: Redis
- **Real-time**: Socket.io
- **Queue**: Bull
- **Testing**: Jest

### Frontend (Next.js)
- **Framework**: Next.js 14 + TypeScript
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query + Zustand
- **Charts**: Chart.js

## 프로젝트 구조

```
robovers/
├── backend/                 # NestJS 백엔드
│   └── src/
│       ├── domain/          # 도메인 계층
│       │   ├── user/        # 사용자 도메인
│       │   ├── robot/       # 로봇 도메인
│       │   ├── community/   # 커뮤니티 도메인
│       │   └── company/     # 기업 도메인
│       ├── application/     # 애플리케이션 계층
│       │   ├── port/        # 포트 인터페이스
│       │   └── service/     # 유스케이스 구현
│       └── adapter/         # 어댑터 계층
│           ├── in/web/      # REST API
│           └── out/         # 외부 연동
├── frontend/                # Next.js 프론트엔드
│   └── src/
│       ├── app/             # Next.js App Router
│       ├── components/      # 재사용 컴포넌트
│       ├── lib/             # 라이브러리
│       └── types/           # 타입 정의
└── shared/                  # 공통 모듈
```

## 개발 명령어

### 전체 프로젝트
```bash
# 의존성 설치
pnpm install

# 개발 서버 실행 (프론트엔드 + 백엔드)
pnpm dev

# 전체 빌드
pnpm build

# 전체 테스트
pnpm test

# 전체 린팅
pnpm lint
```

### 백엔드 (backend/ 디렉토리에서)
```bash
# 개발 서버 실행
pnpm dev

# 빌드
pnpm build

# 테스트
pnpm test

# 테스트 커버리지
pnpm test:cov

# 린팅
pnpm lint

# Prisma 관련
pnpm prisma:generate     # 클라이언트 생성
pnpm prisma:migrate:dev  # 개발용 마이그레이션
pnpm prisma:studio       # Prisma Studio 실행
```

### 프론트엔드 (frontend/ 디렉토리에서)
```bash
# 개발 서버 실행
pnpm dev

# 빌드
pnpm build

# 프로덕션 실행
pnpm start

# 타입 체크
pnpm type-check

# 린팅
pnpm lint
```

### Docker 환경
```bash
# 개발 환경 시작 (PostgreSQL + Redis + pgAdmin)
docker-compose up -d

# 환경 중지
docker-compose down

# 로그 확인
docker-compose logs -f
```

## 개발 지침

### TDD 사이클
Red-Green-Refactor 사이클을 엄격히 준수:
1. **RED**: 실패하는 테스트를 먼저 작성
2. **GREEN**: 테스트를 통과하는 최소한의 코드 작성
3. **REFACTOR**: 테스트를 유지하면서 구조 개선
4. **COMMIT**: 논리적 작업 단위별 커밋

### 헥사고날 아키텍처 규칙
- **Domain 레이어**: 프레임워크 의존성 금지, 순수 비즈니스 로직만
- **Application 레이어**: 도메인 서비스와 아웃바운드 포트 간의 조정만
- **Adapter 레이어**: 프레임워크별 구현체, 외부 시스템 연동
- **의존성 방향**: Adapter → Application → Domain

### 코딩 컨벤션
- **TypeScript**: 엄격한 타입 체크 사용
- **네이밍**: camelCase (변수, 함수), PascalCase (클래스, 인터페이스)
- **파일명**: kebab-case
- **테스트 파일**: `*.spec.ts` 접미사 사용

## 데이터베이스 정보

### 접속 정보 (개발환경)
- **Host**: localhost
- **Port**: 5432
- **Database**: robovers
- **Username**: robovers
- **Password**: robovers123

### pgAdmin 접속 (웹 UI)
- **URL**: http://localhost:8080
- **Email**: admin@robovers.com
- **Password**: admin123

### Redis 접속
- **Host**: localhost
- **Port**: 6379

## API 문서

개발 서버 실행 후 다음 URL에서 API 문서 확인:
- **Swagger UI**: http://localhost:4000/api/docs

## 다음 개발 단계

1. **도메인 모델링**: User, Robot, Community, Company 도메인 구현
2. **유스케이스 구현**: 각 도메인별 애플리케이션 서비스
3. **REST API 구현**: NestJS 컨트롤러 및 DTO
4. **외부 API 연동**: 주가 API, 뉴스 API 어댑터
5. **프론트엔드 UI**: React 컴포넌트 및 페이지 구현

## 참고사항

- 이 프로젝트는 켄트 벡의 TDD 방법론을 따릅니다
- 모든 코드는 헥사고날 아키텍처 원칙을 준수해야 합니다
- 커밋 메시지는 논리적 작업 단위를 설명해야 합니다
- 문서와 주석은 한글을 선호합니다