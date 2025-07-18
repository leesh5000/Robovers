# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Robovers is a humanoid robot information sharing platform built with:

- **Backend**: NestJS with Hexagonal Architecture, Prisma ORM, PostgreSQL
- **Frontend**: Next.js 14, TailwindCSS, TanStack Query
- **Infrastructure**: Docker, Redis, pnpm monorepo

## Essential Commands

### Development

```bash
# Install dependencies (monorepo)
pnpm install

# Run all services in development mode
pnpm dev

# Run specific package
pnpm --filter @robovers/backend dev
pnpm --filter @robovers/frontend dev

# Start Docker services (PostgreSQL, Redis)
docker-compose up -d
```

### Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm --filter @robovers/backend test:watch
pnpm --filter @robovers/frontend test:watch

# Run tests with coverage
pnpm --filter @robovers/backend test:cov

# Run E2E tests
pnpm --filter @robovers/backend test:e2e
```

### Database Management

```bash
# Generate Prisma client
pnpm --filter @robovers/backend prisma:generate

# Create new migration
pnpm --filter @robovers/backend prisma:migrate:dev

# Deploy migrations to production
pnpm --filter @robovers/backend prisma:migrate:deploy

# Open Prisma Studio
pnpm --filter @robovers/backend prisma:studio
```

### Code Quality

```bash
# Run linting
pnpm lint

# Fix linting issues
pnpm lint --fix

# Type checking
pnpm --filter @robovers/frontend type-check

# Format code
pnpm --filter @robovers/frontend format
```

### Build & Production

```bash
# Build all packages
pnpm build

# Build specific package
pnpm --filter @robovers/backend build
pnpm --filter @robovers/frontend build

# Start production server
pnpm --filter @robovers/backend start:prod
pnpm --filter @robovers/frontend start
```

## Architecture Patterns

### Backend - Hexagonal Architecture

The backend follows hexagonal architecture with clear separation of concerns:

```text
backend/src/
├── modules/                 # Feature modules
│   ├── user/
│   │   ├── domain/         # Domain entities, value objects
│   │   ├── application/    # Use cases, DTOs
│   │   ├── infrastructure/ # Repository implementations, external services
│   │   └── presentation/   # Controllers, request/response DTOs
│   ├── robot/
│   ├── community/
│   └── stock/
├── common/                 # Shared utilities, guards, filters
└── config/                # Configuration modules
```

Key principles:

- Domain logic is isolated from infrastructure
- Dependencies point inward (infrastructure → application → domain)
- Use ports (interfaces) and adapters pattern
- Each module is self-contained with its own layers

### Frontend - Component Architecture

The frontend uses Next.js 14 App Router with component-based architecture:

```text
frontend/src/
├── app/                    # Next.js app directory (pages, layouts)
├── components/            
│   ├── ui/                # Reusable UI components
│   ├── features/          # Feature-specific components
│   └── layout/           # Layout components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities, types, API clients
└── services/             # API service layer
```

## Development Methodology

### TDD (Test-Driven Development)

Follow the Red → Green → Refactor cycle:

1. **Red**: Write a failing test for new functionality
2. **Green**: Write minimal code to pass the test
3. **Refactor**: Improve code structure while keeping tests green

### Tidy First Approach

Separate changes into:

- **Structural Changes**: Refactoring without behavior change
- **Behavioral Changes**: Adding/modifying functionality

Never mix both in the same commit.

### Commit Guidelines

Use the following commit template:

```text
[타입]: [50자 이내 요약]

**문제상황:**
[변경이 필요한 이유]

**Solution:**
[Approach and rationale for choice]

**변경사항:**
- [구체적 구현 내용 1]
- [구체적 구현 내용 2]
```

Types: feat, fix, refactor, test, docs, style, chore

### Testing Strategy

1. **Unit Tests**: Test individual functions/methods in isolation
2. **Integration Tests**: Test module interactions
3. **E2E Tests**: Test complete user flows

Always ensure:

- Tests are meaningful and test behavior, not implementation
- Test names clearly describe what is being tested
- Tests run fast and are deterministic

## API Development

### Backend API Structure

- Base URL: `http://localhost:4000/api`
- Swagger Docs: `http://localhost:4000/api/docs`
- All endpoints require `/api` prefix
- Use DTOs for request/response validation
- Implement proper error handling with consistent error responses

### Frontend API Integration

- Use TanStack Query for server state management
- Implement proper loading and error states
- Use Axios interceptors for auth tokens
- Handle API errors gracefully with user-friendly messages

## Database Schema

The project uses PostgreSQL with Prisma ORM. Key models:

- **User**: Authentication and user profiles
- **Robot**: Robot information with specifications
- **Post/Comment**: Community features
- **Company/StockPrice**: Financial data tracking

Always run migrations in development before pushing changes.

## Environment Variables

Required environment variables:

- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `JWT_SECRET`: JWT token secret
- `FRONTEND_URL`: Frontend URL for CORS

## Docker Environment

Services available via Docker Compose:

- PostgreSQL (port 5432)
- Redis (port 6379)
- pgAdmin (port 8080)

Always ensure Docker services are running during development.

## Code Quality Standards

1. **Eliminate duplication**: Extract common code into utilities or shared components
2. **Clear naming**: Use descriptive names that express intent
3. **Small functions**: Keep functions focused on single responsibilities
4. **Type safety**: Leverage TypeScript for type safety
5. **Error handling**: Always handle errors appropriately
6. **Performance**: Consider performance implications, especially for lists and real-time features

## Feedback Loop

After completing tasks, verify:

1. All tests pass (including linting)
2. No TypeScript errors
3. Code follows project conventions
4. Commit messages are clear and follow the template
5. Database migrations are properly created if schema changed
