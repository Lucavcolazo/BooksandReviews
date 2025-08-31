# ---- deps: instala dependencias con cache ----
    FROM node:20-alpine AS deps
    WORKDIR /app
    RUN apk add --no-cache libc6-compat
    COPY package.json package-lock.json* ./
    RUN npm ci
    
    # ---- builder: build de Next en modo standalone ----
    FROM node:20-alpine AS builder
    WORKDIR /app
    ENV NEXT_TELEMETRY_DISABLED=1
    COPY --from=deps /app/node_modules ./node_modules
    COPY . .
    # Si usás variables de build, declaralas con ARG y pasalas en el workflow
    RUN npm run build
    
    # ---- runner: imagen final chiquita ----
    FROM node:20-alpine AS runner
    WORKDIR /app
    ENV NODE_ENV=production
    ENV NEXT_TELEMETRY_DISABLED=1
    # Next standalone build
    COPY --from=builder /app/.next/standalone ./ 
    COPY --from=builder /app/.next/static ./.next/static
    COPY --from=builder /app/public ./public
    
    # Salud y puerto
    EXPOSE 3000
    ENV PORT=3000
    # Arranque del server standalone
    CMD ["node", "server.js"]
    