# Build and start all services
docker-compose up -d --build

# View API logs
docker-compose logs -f api

# Stop all services
docker-compose down

# Rebuild only API
docker-compose up -d --build api