# Build stage
FROM node:20-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install

# Copy prisma schema
COPY prisma ./prisma

# Generate Prisma Client
RUN pnpm prisma:generate

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Production stage
FROM node:20-alpine AS production

# Install pnpm and required packages
RUN corepack enable && corepack prepare pnpm@latest --activate && \
    apk add --no-cache curl

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install production dependencies only
RUN pnpm install --prod

# Copy prisma schema and migrations
COPY --from=builder /app/prisma ./prisma

# Copy built application
COPY --from=builder /app/dist ./dist

# Copy node_modules from builder (includes generated Prisma Client)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Change ownership to nodejs user
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 4010

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:4010/api/health || exit 1

# Start the application
CMD ["node", "dist/main.js"]

# Development stage
FROM node:20-alpine AS development

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install all dependencies
RUN pnpm install

# Copy source code
COPY . .

# Generate Prisma Client
RUN pnpm prisma:generate

# Expose port
EXPOSE 4010

# Start development server
CMD ["pnpm", "start:dev"]