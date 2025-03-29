# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json ./

# Install all dependencies (including devDependencies)
RUN pnpm install

# Copy source code
COPY . .

# Build TypeScript
RUN pnpm build

# Development stage
FROM node:20-alpine AS development

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json ./

# Install all dependencies (including devDependencies)
RUN pnpm install

# Copy source code
COPY . .

# Expose ports
EXPOSE 3000
# Vitest UI port
EXPOSE 5123

# Start the development server
CMD ["pnpm", "run", "dev"]

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json ./

# Install production dependencies only
RUN pnpm install --prod

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"] 