#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "${GREEN}=====================================${NC}"
    echo -e "${GREEN}$1${NC}"
    echo -e "${GREEN}=====================================${NC}"
}

print_error() {
    echo -e "${RED}[ERROR] $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

print_info() {
    echo -e "${GREEN}[INFO] $1${NC}"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Parse command line arguments
COMMAND=${1:-help}
ENVIRONMENT=${2:-development}

case $COMMAND in
    "infra")
        print_header "Starting Infrastructure Services"
        docker-compose -f docker-compose.infra.yml up -d
        print_info "Infrastructure services started!"
        print_info "PostgreSQL: localhost:5432"
        print_info "Redis: localhost:6379"
        print_info "pgAdmin: http://localhost:8080"
        ;;
    
    "dev")
        print_header "Starting Development Environment"
        # Start infrastructure
        docker-compose -f docker-compose.infra.yml up -d
        print_info "Waiting for database to be ready..."
        sleep 5
        
        # Run migrations
        print_info "Running database migrations..."
        cd backend && pnpm prisma:migrate:dev && cd ..
        
        # Start development servers
        print_info "Starting development servers..."
        pnpm dev
        ;;
    
    "build")
        print_header "Building Docker Images"
        docker-compose build --no-cache
        print_info "Docker images built successfully!"
        ;;
    
    "prod")
        print_header "Starting Production Environment"
        # Copy .env.docker to .env if it doesn't exist
        if [ ! -f .env ]; then
            cp .env.docker .env
            print_info "Created .env file from .env.docker"
        fi
        
        # Build and start all services
        docker-compose up -d --build
        print_info "Production environment started!"
        print_info "Frontend: http://localhost:3000"
        print_info "Backend API: http://localhost:4010/api"
        print_info "API Docs: http://localhost:4010/api/docs"
        print_info "pgAdmin: http://localhost:8080"
        ;;
    
    "stop")
        print_header "Stopping All Services"
        docker-compose down
        docker-compose -f docker-compose.infra.yml down
        print_info "All services stopped!"
        ;;
    
    "clean")
        print_header "Cleaning Docker Environment"
        print_warning "This will remove all containers, volumes, and images!"
        read -p "Are you sure? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            docker-compose down -v --rmi all
            docker-compose -f docker-compose.infra.yml down -v --rmi all
            print_info "Docker environment cleaned!"
        else
            print_info "Cleanup cancelled."
        fi
        ;;
    
    "logs")
        SERVICE=${2:-all}
        if [ "$SERVICE" = "all" ]; then
            docker-compose logs -f
        else
            docker-compose logs -f $SERVICE
        fi
        ;;
    
    "status")
        print_header "Service Status"
        docker-compose ps
        echo
        docker-compose -f docker-compose.infra.yml ps
        ;;
    
    "migrate")
        print_header "Running Database Migrations"
        docker-compose exec backend pnpm prisma:migrate:deploy
        print_info "Migrations completed!"
        ;;
    
    "seed")
        print_header "Seeding Database"
        docker-compose exec backend pnpm prisma db seed
        print_info "Database seeded!"
        ;;
    
    *)
        print_header "Robovers Docker Manager"
        echo "Usage: ./docker-start.sh [command] [options]"
        echo
        echo "Commands:"
        echo "  infra     - Start only infrastructure services (PostgreSQL, Redis, pgAdmin)"
        echo "  dev       - Start development environment (infra + local dev servers)"
        echo "  build     - Build Docker images"
        echo "  prod      - Start production environment (all services containerized)"
        echo "  stop      - Stop all services"
        echo "  clean     - Remove all containers, volumes, and images"
        echo "  logs      - View logs (usage: ./docker-start.sh logs [service])"
        echo "  status    - Show status of all services"
        echo "  migrate   - Run database migrations"
        echo "  seed      - Seed the database"
        echo
        echo "Examples:"
        echo "  ./docker-start.sh infra    # Start only databases for local development"
        echo "  ./docker-start.sh dev      # Start full development environment"
        echo "  ./docker-start.sh prod     # Start production environment"
        echo "  ./docker-start.sh logs backend  # View backend logs"
        ;;
esac