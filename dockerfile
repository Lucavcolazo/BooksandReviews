# Multi-stage build para optimizar el tamaño final
FROM node:18-alpine AS base

# Instalar dependencias solo cuando sea necesario
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Instalar TODAS las dependencias (incluyendo devDependencies)
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js recolecta información completamente anónima sobre el uso general.
# Desactivar telemetry durante el build.
ENV NEXT_TELEMETRY_DISABLED=1

# Variables necesarias durante el build con valores dummy por defecto
# Nota: En runtime, debes sobreescribirlas al ejecutar el contenedor
ARG MONGODB_URI=dummy-mongodb-uri
ARG JWT_SECRET=dummy-jwt-secret
ARG OPENROUTER_API_KEY=dummy-openrouter-key
ENV MONGODB_URI=$MONGODB_URI
ENV JWT_SECRET=$JWT_SECRET
ENV OPENROUTER_API_KEY=$OPENROUTER_API_KEY

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Desactivar telemetry durante el runtime.
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Copiar los archivos estáticos generados
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# server.js is created by next build from the standalone output
CMD ["node", "server.js"]