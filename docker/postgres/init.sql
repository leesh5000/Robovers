-- PostgreSQL 초기화 스크립트
-- 개발 환경용 초기 설정

-- 확장 모듈 활성화
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- 개발용 사용자 생성 (이미 존재할 수 있으므로 무시)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'robovers_dev') THEN
    CREATE ROLE robovers_dev WITH LOGIN PASSWORD 'dev123';
    GRANT CONNECT ON DATABASE robovers TO robovers_dev;
  END IF;
END
$$;

-- 개발 환경 로그 설정
ALTER SYSTEM SET log_statement = 'all';
ALTER SYSTEM SET log_duration = on;
ALTER SYSTEM SET log_min_duration_statement = 0;

-- 설정 리로드
SELECT pg_reload_conf();