# ==========================================
# Stage 1: Dependencies
# ==========================================
FROM node:20-alpine AS dependencies

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --only=production && npm cache clean --force

# ==========================================
# Stage 2: Builder
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar dependencias del stage anterior
COPY --from=dependencies /app/node_modules ./node_modules

# Copiar archivos de configuración
COPY package*.json tsconfig.json ./

# Copiar código fuente
COPY src/ ./src/

# Compilar TypeScript
RUN npm run build

# ==========================================
# Stage 3: Production
# ==========================================
FROM node:20-alpine AS production

# Instalar dumb-init para manejo correcto de señales
RUN apk add --no-cache dumb-init

# Directorio de trabajo
WORKDIR /app

# Copiar dependencias de producción
COPY --from=dependencies /app/node_modules ./node_modules

# Copiar archivos compilados
COPY --from=builder /app/dist ./dist

# Copiar package.json (para metadata)
COPY --from=builder /app/package.json ./

# Crear directorio para logs
RUN mkdir -p /app/logs && chown -R node:node /app

# Cambiar a usuario no-root (node ya existe en imagen oficial)
USER node

# Exponer puerto
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1

# Usar dumb-init para manejo correcto de señales
ENTRYPOINT ["dumb-init", "--"]

# Comando de inicio
CMD ["node", "dist/main.js"]
