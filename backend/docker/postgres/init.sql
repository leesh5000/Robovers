-- Initial database setup for Robovers application

-- Create custom types if needed
CREATE TYPE user_role AS ENUM ('ADMIN', 'USER', 'GUEST');

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Initial schema setup
CREATE SCHEMA IF NOT EXISTS robovers;

-- Set default search path
SET search_path TO robovers, public;

-- Grant permissions
GRANT ALL ON SCHEMA robovers TO robovers;
GRANT ALL ON ALL TABLES IN SCHEMA robovers TO robovers;
GRANT ALL ON ALL SEQUENCES IN SCHEMA robovers TO robovers;