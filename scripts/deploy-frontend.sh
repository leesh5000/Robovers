#!/bin/bash

# Frontend 배포 스크립트
# 사용법: ./deploy-frontend.sh <docker-image-tag>

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
CONTAINER_NAME="robovers-frontend"
HEALTH_CHECK_URL="http://localhost:4000"
MAX_RETRIES=30
RETRY_DELAY=2

log "프론트엔드 배포 시작..."
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
    warning "환경 변수 파일이 없습니다: ${ENV_FILE}"
    warning "기본 설정으로 진행합니다."
    ENV_FILE_ARG=""
else
    ENV_FILE_ARG="--env-file ${ENV_FILE}"
fi

# 5. 새 컨테이너 실행
log "새 컨테이너 시작 중..."
docker run -d \
    --name "${CONTAINER_NAME}" \
    --restart unless-stopped \
    -p 4000:3000 \
    ${ENV_FILE_ARG} \
    -e NODE_ENV=production \
    -e NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-"http://localhost:4010/api"} \
    --network robovers-network \
    "${IMAGE_TAG}"

# 6. 컨테이너 상태 확인
sleep 2
if ! docker ps | grep -q "${CONTAINER_NAME}"; then
    error "컨테이너 시작 실패!"
    docker logs "${CONTAINER_NAME}" | tail -20
    exit 1
fi

log "컨테이너가 성공적으로 시작되었습니다."

# 7. 헬스체크
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

# 8. 이전 이미지 정리
log "사용하지 않는 Docker 이미지 정리 중..."
docker image prune -f --filter "dangling=true"

# 9. 배포 완료
log "프론트엔드 배포가 성공적으로 완료되었습니다!"
log "컨테이너 상태:"
docker ps --filter "name=${CONTAINER_NAME}" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

exit 0