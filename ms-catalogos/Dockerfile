# ============================================================================
# STAGE 1: Build
# ============================================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies for native modules
RUN apk add --no-cache python3 make g++

# Copy dependency files
COPY package*.json ./
COPY tsconfig.json ./
COPY nest-cli.json ./

# Install ALL dependencies (including devDependencies for build)
RUN npm ci && npm cache clean --force

# Copy source code
COPY src ./src

# Build the application
RUN npm run build

# ============================================================================
# STAGE 2: Production
# ============================================================================
FROM node:20-alpine AS production

# Metadata labels (OCI standard)
LABEL org.opencontainers.image.title="ms-catalogos"
LABEL org.opencontainers.image.description="Microservicio de Catálogos - SeguraX Cotizador"
LABEL org.opencontainers.image.version="1.0.0"
LABEL org.opencontainers.image.authors="DevOps Team"

WORKDIR /app

# Create non-root user and group
# Using numeric UID/GID to avoid issues with user resolution in Kubernetes
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# Copy dependency files
COPY package*.json ./

# Install only production dependencies
# --omit=dev es la forma moderna (npm 8.0+)
RUN npm ci --omit=dev && \
    npm cache clean --force && \
    rm -rf /tmp/*

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Change ownership to non-root user
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose application port
EXPOSE 3001

# NO HEALTHCHECK - Segun requerimiento del usuario

# Run the application
CMD ["node", "dist/main.js"]
