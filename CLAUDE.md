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
# Run all tests (unit + integration)
pnpm test

# Run specific test types
pnpm --filter @robovers/backend test:int        # Integration tests only
pnpm --filter @robovers/backend test:all        # Unit + Integration tests
pnpm --filter @robovers/backend test:e2e        # E2E tests (in test/e2e/)

# Run tests in watch mode
pnpm --filter @robovers/backend test:watch
pnpm --filter @robovers/frontend test:watch

# Run tests with coverage
pnpm --filter @robovers/backend test:cov
pnpm --filter @robovers/frontend test:coverage

# Run single test file
pnpm --filter @robovers/backend test -- user.entity.spec.ts
pnpm --filter @robovers/frontend test -- ArticleCard.test.tsx

# Debug tests
pnpm --filter @robovers/backend test:debug
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

The backend follows hexagonal architecture with Domain-Driven Design (DDD) patterns:

```text
backend/src/
├── modules/                 # Feature modules
│   ├── user/
│   │   ├── domain/
│   │   │   ├── entities/           # Domain entities (User, EmailVerification)
│   │   │   ├── value-objects/      # Value objects (Email, Password, Nickname)
│   │   │   ├── repositories/       # Repository interfaces (ports)
│   │   │   ├── factories/          # Entity factories
│   │   │   └── exceptions/         # Domain-specific exceptions
│   │   ├── application/
│   │   │   ├── use-cases/          # Business use cases
│   │   │   └── services/           # Application service interfaces
│   │   ├── infrastructure/
│   │   │   ├── persistence/
│   │   │   │   ├── prisma/         # Prisma repository implementations
│   │   │   │   └── mappers/        # Domain-DB mapping
│   │   │   ├── services/           # External service implementations
│   │   │   ├── auth/               # JWT strategy, guards
│   │   │   └── config/             # Module configuration
│   │   ├── presentation/
│   │   │   ├── controllers/        # REST controllers
│   │   │   ├── dtos/               # Request/response DTOs
│   │   │   ├── decorators/         # Custom decorators
│   │   │   └── validators/         # Input validation
│   │   └── test/
│   │       ├── unit/               # Domain & application layer tests
│   │       ├── integration/        # Infrastructure layer tests
│   │       ├── e2e/                # End-to-end tests
│   │       └── fakes/              # Test doubles & fake implementations
├── common/                         # Shared utilities (Prisma, Snowflake ID)
└── main.ts                        # Application bootstrap
```

**Key DDD Patterns Implemented:**

- **Entities**: Rich domain objects with business logic and invariants
- **Value Objects**: Immutable objects representing descriptive aspects (Email, Password)
- **Factories**: Object creation with complex business rules
- **Repositories**: Data access abstraction with mapper pattern
- **Use Cases**: Application-specific business rules
- **Domain Exceptions**: Business rule violations expressed as exceptions

**Dependency Direction:**
- Infrastructure → Application → Domain
- All dependencies point inward
- Domain layer has no external dependencies
- Infrastructure implements domain interfaces

### Frontend - Component Architecture

The frontend uses Next.js 14 App Router with feature-based component organization:

```text
frontend/src/
├── app/                            # Next.js app directory
│   ├── (routes)/                   # Route groups
│   ├── admin/                      # Admin panel routes
│   ├── community/[id]/             # Dynamic community post routes
│   ├── robots/[id]/                # Dynamic robot detail routes
│   └── globals.css                 # Global styles
├── components/
│   ├── ui/                         # Reusable UI components
│   │   ├── Dropdown.tsx            # Custom dropdown with keyboard nav
│   │   └── Pagination.tsx          # Reusable pagination
│   ├── auth/                       # Authentication components
│   ├── community/                  # Community feature components
│   │   ├── PostDetail.tsx          # Post detail with comments
│   │   ├── CommentList.tsx         # Comment system with replies
│   │   └── CategoryFilter.tsx      # Category filtering
│   ├── robot/                      # Robot information components
│   │   ├── RobotDetail.tsx         # Detailed robot specifications
│   │   └── RobotGrid.tsx           # Robot listing with filters
│   ├── feed/                       # News feed components
│   ├── layout/                     # Layout and navigation
│   └── admin/                      # Admin panel components
├── hooks/                          # Custom React hooks
│   └── useInfiniteScroll.ts        # Infinite scroll implementation
├── lib/
│   ├── api/                        # API client functions
│   ├── types.ts                    # TypeScript type definitions
│   ├── dummy-data.ts               # Mock data for development
│   └── validation.ts               # Form validation utilities
├── stores/                         # Zustand state management
└── middleware.ts                   # Next.js middleware
```

**Key Frontend Patterns:**

- **Custom UI Components**: Consistent design system with Dropdown, Pagination
- **Feature-Based Organization**: Components grouped by business domain
- **Mock Data Strategy**: Comprehensive dummy data for offline development
- **State Management**: Zustand for global state, TanStack Query for server state
- **Type Safety**: Comprehensive TypeScript interfaces for all data structures

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

- Base URL: `http://localhost:4010/api`
- Swagger Docs: `http://localhost:4010/api/docs`
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

## Development Workflow

### Service Ports & URLs

**Development Services:**
- Frontend: `http://localhost:4000` (Next.js)
- Backend API: `http://localhost:4010/api` (NestJS)
- API Documentation: `http://localhost:4010/api/docs` (Swagger)

**Infrastructure Services:**
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379` 
- pgAdmin: `http://localhost:8080`

### Docker Environment

```bash
# Start all infrastructure services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs postgres
docker-compose logs redis

# Stop services
docker-compose down
```

**Default Database Credentials:**
- Database: `robovers`
- Username: `robovers`
- Password: `robovers123`

**pgAdmin Access:**
- Email: `admin@robovers.com`
- Password: `admin123`

### Development Prerequisites

1. **Start Infrastructure:**
   ```bash
   docker-compose up -d
   ```

2. **Install Dependencies:**
   ```bash
   pnpm install
   ```

3. **Database Setup:**
   ```bash
   pnpm --filter @robovers/backend prisma:generate
   pnpm --filter @robovers/backend prisma:migrate:dev
   ```

4. **Start Development Servers:**
   ```bash
   pnpm dev  # Both frontend and backend
   # OR separately:
   pnpm --filter @robovers/backend dev
   pnpm --filter @robovers/frontend dev
   ```

## TypeScript Configuration & Path Mapping

### Backend Path Mapping
```typescript
// Backend imports use @ prefixes (configured in tsconfig.json)
import { UserEntity } from '@/modules/user/domain/entities/user.entity';
import { EmailService } from '@/modules/user/application/services/email.service.interface';
```

### Frontend Path Mapping
```typescript
// Frontend imports use @ prefix for src directory
import { Button } from '@/components/ui/Button';
import { PostDetail } from '@/components/community/PostDetail';
import { UserType } from '@/lib/types';
```

### Mock Data Development

The frontend includes comprehensive mock data for offline development:

```typescript
// Use dummy data functions for development
import { getDummyPosts, getDummyComments } from '@/lib/dummy-data';

// Mock data includes:
// - Community posts with realistic content
// - User profiles with Korean names
// - Robot specifications and features
// - Company information and stock data
// - Comment threads with nested replies
```

## Debugging & Troubleshooting

### Common Development Issues

**Port Conflicts:**
- Frontend default port changed to 4000 (not 3000)
- Backend API runs on 4010 with `/api` prefix
- Always check `docker-compose ps` for service status

**Database Connection Issues:**
```bash
# Restart database container
docker-compose restart postgres

# Check database logs
docker-compose logs postgres

# Reset database (development only)
docker-compose down -v
docker-compose up -d
pnpm --filter @robovers/backend prisma:migrate:dev
```

**Testing Issues:**
```bash
# Integration tests require TestContainers
# Ensure Docker is running before running integration tests
pnpm --filter @robovers/backend test:int

# For debugging failing tests
pnpm --filter @robovers/backend test:debug
```

### Korean Development Context

- **Commit Messages**: Use Korean for commit messages following the template
- **UI Text**: All user-facing text is in Korean
- **Error Messages**: Provide Korean error messages for user-facing errors
- **Data Modeling**: Consider Korean text encoding in database fields

## Code Quality Standards

1. **Eliminate duplication**: Extract common code into utilities or shared components
2. **Clear naming**: Use descriptive names that express intent
3. **Small functions**: Keep functions focused on single responsibilities
4. **Type safety**: Leverage TypeScript for type safety
5. **Error handling**: Always handle errors appropriately
6. **Performance**: Consider performance implications, especially for lists and real-time features
7. **Consistent UI**: Use custom Dropdown and UI components instead of native HTML elements

## Feedback Loop

After completing tasks, verify:

1. All tests pass (including linting)
2. No TypeScript errors
3. Code follows project conventions
4. Commit messages are clear and follow the template
5. Database migrations are properly created if schema changed
