# ============================================================================
# Stage 1: Dependencies
# ============================================================================
FROM node:20-alpine AS dependencies

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install only production dependencies
# --omit=dev es la forma moderna (npm 8.0+)
RUN npm ci --omit=dev && npm cache clean --force

# ============================================================================
# Stage 2: Builder
# ============================================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependencies from previous stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy configuration files
COPY package*.json tsconfig.json ./

# Copy source code
COPY src/ ./src/

# Compile TypeScript
RUN npm run build

# ============================================================================
# Stage 3: Production
# ============================================================================
FROM node:20-alpine AS production

# Metadata labels (OCI standard)
LABEL org.opencontainers.image.title="ms-core"
LABEL org.opencontainers.image.description="Backend Core API - SeguraX Cotizador"
LABEL org.opencontainers.image.version="1.0.0"
LABEL org.opencontainers.image.authors="DevOps Team"

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Working directory
WORKDIR /app

# Copy production dependencies
COPY --from=dependencies /app/node_modules ./node_modules

# Copy compiled files
COPY --from=builder /app/dist ./dist

# Copy package.json (for metadata)
COPY --from=builder /app/package.json ./

# Create log directory
RUN mkdir -p /app/logs && chown -R node:node /app

# Change to non-root user (node already exists in official image)
USER node

# Expose port
EXPOSE 3000

# NO HEALTHCHECK - Segun requerimiento del usuario

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]

# Start command
CMD ["node", "dist/main.js"]
