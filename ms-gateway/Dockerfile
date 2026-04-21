# ============================================================================
# STAGE 1: Build
# ============================================================================
FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /build

# Install Maven
RUN apk add --no-cache maven

# Copy pom.xml first (for layer caching)
COPY pom.xml .

# Download dependencies (cached layer)
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application (skip tests for faster build, run tests separately)
RUN mvn clean package -DskipTests -B && \
    mkdir -p target/dependency && \
    cd target/dependency && \
    jar -xf ../*.jar

# ============================================================================
# STAGE 2: Production
# ============================================================================
FROM eclipse-temurin:17-jre-alpine AS production

# Metadata labels (OCI standard)
LABEL org.opencontainers.image.title="ms-gateway"
LABEL org.opencontainers.image.description="API Gateway for Cotizador SeguraX"
LABEL org.opencontainers.image.version="1.0.0"
LABEL org.opencontainers.image.authors="DevOps Team"

WORKDIR /app

# Create non-root user and group
# Using numeric UID/GID for Kubernetes compatibility
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# Copy the built JAR from builder stage
COPY --from=builder /build/target/*.jar app.jar

# Change ownership to non-root user
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose application port
EXPOSE 8080

# NO HEALTHCHECK - Segun requerimiento del usuario

# Run the application
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
