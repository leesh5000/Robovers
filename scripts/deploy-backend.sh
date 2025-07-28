#!/bin/bash

# Backend 배포 스크립트
# 사용법: ./deploy-backend.sh <docker-image-tag>

set -euo pipefail

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 함수: 로그 출력
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1" >&2
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
}

# 인자 확인
if [ $# -eq 0 ]; then
    error "Docker 이미지 태그를 인자로 제공해주세요."
    echo "사용법: $0 <docker-image-tag>"
    exit 1
fi

IMAGE_TAG="$1"
CONTAINER_NAME="robovers-backend"
HEALTH_CHECK_URL="http://localhost:4010/api/health"
MAX_RETRIES=30
RETRY_DELAY=2

log "백엔드 배포 시작..."
log "이미지 태그: ${IMAGE_TAG}"

# 1. ECR 로그인
log "ECR 로그인 중..."
aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin ${IMAGE_TAG%%:*}

# 2. 새 이미지 다운로드
log "새 Docker 이미지 다운로드 중..."
if ! docker pull "${IMAGE_TAG}"; then
    error "Docker 이미지 다운로드 실패: ${IMAGE_TAG}"
    exit 1
fi

# 3. 기존 컨테이너 확인 및 정지
if docker ps -a --format "table {{.Names}}" | grep -q "^${CONTAINER_NAME}$"; then
    log "기존 컨테이너 정지 중..."
    docker stop "${CONTAINER_NAME}" || true
    docker rm "${CONTAINER_NAME}" || true
fi

# 4. 환경 변수 파일 확인
ENV_FILE=".env.production"
if [ ! -f "${ENV_FILE}" ]; then
    error "환경 변수 파일이 없습니다: ${ENV_FILE}"
    error "백엔드 실행에 필요한 환경 변수를 설정해주세요."
    echo "필수 환경 변수:"
    echo "  - DATABASE_URL"
    echo "  - REDIS_URL"
    echo "  - JWT_SECRET"
    echo "  - JWT_EXPIRES_IN"
    echo "  - EMAIL_FROM"
    echo "  - EMAIL_FROM_NAME"
    echo "  - NODE_ENV"
    exit 1
fi

# 5. Docker 네트워크 확인 및 생성
NETWORK_NAME="robovers-network"
if ! docker network ls | grep -q "${NETWORK_NAME}"; then
    log "Docker 네트워크 생성 중..."
    docker network create "${NETWORK_NAME}"
fi

# 6. PostgreSQL 컨테이너 확인
if ! docker ps | grep -q "robovers-postgres"; then
    warning "PostgreSQL 컨테이너가 실행 중이지 않습니다."
    warning "데이터베이스가 올바르게 설정되어 있는지 확인하세요."
fi

# 7. Redis 컨테이너 확인
if ! docker ps | grep -q "robovers-redis"; then
    warning "Redis 컨테이너가 실행 중이지 않습니다."
    warning "Redis가 올바르게 설정되어 있는지 확인하세요."
fi

# 8. 새 컨테이너 실행
log "새 컨테이너 시작 중..."
docker run -d \
    --name "${CONTAINER_NAME}" \
    --restart unless-stopped \
    -p 4010:4010 \
    --env-file "${ENV_FILE}" \
    -e NODE_ENV=production \
    --network "${NETWORK_NAME}" \
    "${IMAGE_TAG}"

# 9. 컨테이너 상태 확인
sleep 3
if ! docker ps | grep -q "${CONTAINER_NAME}"; then
    error "컨테이너 시작 실패!"
    docker logs "${CONTAINER_NAME}" | tail -50
    exit 1
fi

log "컨테이너가 성공적으로 시작되었습니다."

# 10. 데이터베이스 마이그레이션 실행
log "데이터베이스 마이그레이션 실행 중..."
if ! docker exec "${CONTAINER_NAME}" npx prisma migrate deploy; then
    error "데이터베이스 마이그레이션 실패!"
    docker logs "${CONTAINER_NAME}" | tail -50
    exit 1
fi

# 11. 헬스체크
log "헬스체크 수행 중..."
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -f "${HEALTH_CHECK_URL}" > /dev/null 2>&1; then
        log "헬스체크 성공!"
        break
    fi
    
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
        error "헬스체크 실패! 최대 재시도 횟수 초과"
        docker logs "${CONTAINER_NAME}" | tail -50
        exit 1
    fi
    
    warning "헬스체크 재시도 중... ($RETRY_COUNT/$MAX_RETRIES)"
    sleep $RETRY_DELAY
done

# 12. 애플리케이션 상태 확인
log "애플리케이션 상태 확인 중..."
if curl -s "${HEALTH_CHECK_URL}" | grep -q "ok"; then
    log "애플리케이션이 정상적으로 실행 중입니다."
else
    warning "헬스체크 응답이 예상과 다릅니다."
fi

# 13. 이전 이미지 정리
log "사용하지 않는 Docker 이미지 정리 중..."
docker image prune -f --filter "dangling=true"

# 14. 배포 완료
log "백엔드 배포가 성공적으로 완료되었습니다!"
log "컨테이너 상태:"
docker ps --filter "name=${CONTAINER_NAME}" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# 15. 로그 확인 안내
log "로그 확인 명령어:"
echo "  docker logs -f ${CONTAINER_NAME}"

exit 0