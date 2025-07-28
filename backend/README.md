# Robovers Backend

휴머노이드 로봇 정보 공유 플랫폼의 백엔드 API 서버입니다.

<!-- CI/CD 파이프라인 테스트: 2025-07-28 -->

## 기술 스택

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL (Prisma ORM)
- **Authentication**: JWT (Passport.js)
- **Cache**: Redis
- **Architecture**: Clean Architecture (DDD)

## 프로젝트 구조

```
src/
├── modules/
│   └── user/
│       ├── domain/           # 비즈니스 로직과 엔티티
│       ├── application/      # 유스케이스 (Commands/Queries)
│       ├── infrastructure/   # 외부 시스템 구현체
│       └── interfaces/       # API 컨트롤러와 DTO
├── common/
│   ├── exceptions/          # 전역 예외 클래스
│   ├── guards/              # 인증/인가 가드
│   └── prisma/              # Prisma 서비스
└── main.ts                  # 애플리케이션 진입점
```

## 시작하기

### 필수 요구사항

- Node.js 18+
- Docker & Docker Compose
- PNPM

### 환경 설정

1. 환경 변수 설정:
```bash
cp .env.example .env
```

2. Docker 컨테이너 실행:
```bash
docker-compose up -d
```

3. 의존성 설치:
```bash
pnpm install
```

4. 데이터베이스 마이그레이션:
```bash
pnpm prisma:generate
pnpm prisma:migrate:dev
```

### 개발 서버 실행

```bash
pnpm start:dev
```

서버는 `http://localhost:4010/api`에서 실행됩니다.

## API 문서

Swagger 문서는 `http://localhost:4010/api/docs`에서 확인할 수 있습니다.

## 주요 엔드포인트

### 인증 (Auth)
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `POST /api/auth/verify-email` - 이메일 인증

### 사용자 (Users)
- `GET /api/users/me` - 내 프로필 조회
- `PUT /api/users/me` - 내 프로필 수정

## 테스트

```bash
# 단위 테스트
pnpm test

# 테스트 커버리지
pnpm test:cov

# E2E 테스트
pnpm test:e2e
```

## 클린 아키텍처 원칙

이 프로젝트는 클린 아키텍처 원칙을 따릅니다:

1. **도메인 레이어**: 비즈니스 로직과 규칙
2. **애플리케이션 레이어**: 유스케이스 구현
3. **인프라스트럭처 레이어**: 외부 시스템과의 통합
4. **인터페이스 레이어**: HTTP 요청/응답 처리

각 레이어는 의존성 역전 원칙을 통해 느슨하게 결합되어 있습니다.