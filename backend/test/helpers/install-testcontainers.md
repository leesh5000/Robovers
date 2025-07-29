# TestContainers 설치 가이드

## 필요 조건
1. Docker Desktop이 설치되어 있어야 함
2. pnpm 또는 npm 패키지 매니저

## 설치 방법

### 1. pnpm 사용 (권장)
```bash
cd backend
pnpm install
```

### 2. npm 사용
```bash
cd backend
npm install
```

### 3. 수동 설치 (필요시)
```bash
cd backend
pnpm add -D testcontainers @testcontainers/postgresql @testcontainers/redis
```

## 테스트 실행

### 통합 테스트 활성화
1. `test/integration/auth/auth-flow.int-spec.ts`에서 `describe.skip` 제거
2. `test/integration/user/user-management.int-spec.ts`에서 `describe.skip` 제거

### 테스트 실행
```bash
# 통합 테스트만 실행
pnpm test:int

# 모든 테스트 실행
pnpm test:all
```

## 주의사항
- 통합 테스트는 Docker 컨테이너를 실행하므로 시간이 오래 걸릴 수 있습니다
- 첫 실행 시 PostgreSQL과 Redis 이미지를 다운로드합니다
- Windows 환경에서는 Docker Desktop이 실행 중이어야 합니다

## 문제 해결
- 패키지 설치 실패 시: `pnpm install --force` 시도
- Docker 권한 오류 시: Docker Desktop 재시작
- 포트 충돌 시: 기존 컨테이너 중지 후 재실행