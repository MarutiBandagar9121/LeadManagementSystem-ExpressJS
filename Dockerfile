# Dockerfile (create this in your Express app root directory)
FROM node:22-alpine

# Set working directory in container
WORKDIR /app

# Copy package files first (for better Docker layer caching)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

EXPOSE 3000

# Start the application
CMD ["sh", "-c", "npm run build && npm start"]