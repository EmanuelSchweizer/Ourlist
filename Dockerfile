# Dependencies
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# NEXT_PUBLIC_* values are baked into the client bundle at build time, so they must be available here
ARG NEXT_PUBLIC_SIGNALR_URL
ENV NEXT_PUBLIC_SIGNALR_URL=$NEXT_PUBLIC_SIGNALR_URL
RUN npm run build

# Runtime
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Dedicated, unprivileged user instead of root – security best practice
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
EXPOSE 3000

CMD ["node", "server.js"]
