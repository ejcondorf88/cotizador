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

# Build de la aplicación
RUN npm run build

# Cambiar permisos
RUN chown -R appuser:appgroup /app

# ==========================================
# Stage 2: Production (Nginx)
# ==========================================
FROM nginx:1.25-alpine AS production

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

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:8080/ || exit 1

# Comando de inicio
CMD ["nginx", "-g", "daemon off;"]
