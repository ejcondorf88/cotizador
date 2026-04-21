# ==========================================
# Stage 1: Builder
# ==========================================
FROM node:20-alpine AS builder

# Crear usuario no-root
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# Directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias (incluye devDependencies para build)
RUN npm ci && npm cache clean --force

# Copiar código fuente
COPY . .

# VITE_API_URL se inyecta en build-time.
# Valor por defecto: /api/v1 (URL relativa al mismo host).
# El browser pide /api/v1/... al mismo host → el gateway lo intercepta.
# Así el frontend NO depende de la IP pública de la EC2.
ARG VITE_API_URL=/api/v1
ENV VITE_API_URL=${VITE_API_URL}

# Build de la aplicación
RUN npm run build

# Cambiar permisos
RUN chown -R appuser:appgroup /app

# ==========================================
# Stage 2: Production (Nginx)
# ==========================================
FROM nginx:1.25-alpine AS production

# Metadata labels (OCI standard)
LABEL org.opencontainers.image.title="frontend"
LABEL org.opencontainers.image.description="Frontend React - SeguraX Cotizador"
LABEL org.opencontainers.image.version="1.0.0"
LABEL org.opencontainers.image.authors="DevOps Team"

# Crear usuario no-root para Nginx
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d/default.conf

# Copiar archivos estáticos del builder
COPY --from=builder --chown=appuser:appgroup /app/dist /usr/share/nginx/html

# Crear directorio para logs y cache
RUN mkdir -p /var/cache/nginx /var/log/nginx /tmp/nginx && \
    chown -R appuser:appgroup /var/cache/nginx /var/log/nginx /tmp/nginx /usr/share/nginx/html && \
    chmod -R 755 /var/cache/nginx /var/log/nginx /tmp/nginx /usr/share/nginx/html

# Cambiar configuración de Nginx para usar puerto no-privilegiado
RUN sed -i 's/listen 80/listen 8080/g' /etc/nginx/conf.d/default.conf && \
    sed -i 's/user nginx/user appuser/g' /etc/nginx/nginx.conf

# Cambiar usuario
USER appuser

# Exponer puerto no-privilegiado
EXPOSE 8080

# NO HEALTHCHECK - Segun requerimiento del usuario

# Comando de inicio
CMD ["nginx", "-g", "daemon off;"]
