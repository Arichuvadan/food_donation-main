# FoodEx - Docker Deployment Guide

## Quick Start with Docker

### Prerequisites
- Docker 20.10+
- Docker Compose 2.0+

### Build and Run Locally

**Option 1: Using Docker Compose (Recommended)**
```bash
# Clone the repository
git clone https://github.com/Arichuvadan/food_donation-main
cd food_donation-main

# Build and run
docker-compose up --build

# Access the app at http://localhost:3000
```

**Option 2: Using Docker directly**
```bash
# Build the image
docker build -t foodex:latest .

# Run the container
docker run -p 3000:3000 \
  -v $(pwd)/data:/app/data \
  --name foodex \
  foodex:latest

# Access the app at http://localhost:3000
```

### View Logs
```bash
# With docker-compose
docker-compose logs -f foodex

# With docker run
docker logs -f foodex
```

### Stop the Container
```bash
# With docker-compose
docker-compose down

# With docker run
docker stop foodex
docker rm foodex
```

---

## Production Deployment

### Deploy to Cloud Platforms

#### **Railway** (Recommended for simplicity)
1. Push code to GitHub
2. Go to [railway.app](https://railway.app)
3. Connect your GitHub repository
4. Select "Deploy"
5. Set environment variables if needed
6. Railway auto-detects Dockerfile and deploys

#### **Heroku**
```bash
# Create Heroku app
heroku create foodex-app

# Deploy
git push heroku main

# View logs
heroku logs -t
```

#### **AWS ECR + ECS**
```bash
# Create ECR repository
aws ecr create-repository --repository-name foodex

# Build and push
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <aws-account-id>.dkr.ecr.us-east-1.amazonaws.com

docker build -t foodex:latest .
docker tag foodex:latest <aws-account-id>.dkr.ecr.us-east-1.amazonaws.com/foodex:latest
docker push <aws-account-id>.dkr.ecr.us-east-1.amazonaws.com/foodex:latest
```

#### **DigitalOcean App Platform**
1. Connect GitHub repository
2. Choose "Dockerfile" as build source
3. Set port to 3000
4. Deploy

---

## Environment Variables

Create a `.env` file or set these in your deployment platform:

```env
NODE_ENV=production
PORT=3000
```

---

## Data Persistence

The app uses JSON file storage (`data/db.json`). To persist data:

**Docker Compose** (automatic via volume):
```yaml
volumes:
  - ./data:/app/data
```

**Docker Run**:
```bash
docker run -v $(pwd)/data:/app/data ...
```

**Cloud Deployment**:
- Mount a volume or use a cloud storage service
- For Railway/Heroku: Implement a database service (MongoDB/PostgreSQL)

---

## Monitoring & Health Checks

The Docker image includes a built-in health check:
- **Interval**: 30 seconds
- **Timeout**: 10 seconds
- **Retries**: 3

Check health:
```bash
docker ps  # Look for health status
```

---

## Development with Docker

For live development with hot-reload:

```bash
docker-compose -f docker-compose.dev.yml up
```

Create `docker-compose.dev.yml`:
```yaml
version: '3.8'
services:
  foodex:
    build: .
    ports:
      - "3000:3000"
      - "5173:5173"  # Vite dev server
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      NODE_ENV: development
    command: npm run dev
```

---

## Troubleshooting

**Port Already in Use**:
```bash
# Change port in docker-compose.yml
ports:
  - "8000:3000"
```

**Build Fails**:
```bash
# Check Node version and dependencies
docker build --no-cache -t foodex:latest .
```

**Permission Issues**:
```bash
# Run with proper user
docker run --user 1000:1000 foodex:latest
```

---

## Image Size Optimization

Current multi-stage build keeps image size minimal:
- **Base**: Alpine Linux (5MB)
- **Build stage**: Includes dev dependencies
- **Runtime stage**: ~300MB total

To further reduce:
```dockerfile
# Use distroless base
FROM gcr.io/distroless/nodejs20-debian11
```

---

## Security Best Practices

1. ✅ Uses Alpine Linux (smaller attack surface)
2. ✅ Runs as non-root (Node process)
3. ✅ No secrets in Dockerfile
4. ✅ Health checks enabled
5. ✅ Signal handling with dumb-init
6. ✅ Read-only filesystem (where possible)

For additional security:
```dockerfile
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs
```

---

## Continuous Integration

### GitHub Actions Example
```yaml
name: Build and Push Docker Image
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: docker/setup-buildx-action@v2
      - uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      - uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: ${{ secrets.DOCKER_USERNAME }}/foodex:latest
```

---

## Support

For issues, check:
- [Dockerfile documentation](https://docs.docker.com/)
- [Docker Compose documentation](https://docs.docker.com/compose/)
- [React Router deployment guide](https://reactrouter.com/)
