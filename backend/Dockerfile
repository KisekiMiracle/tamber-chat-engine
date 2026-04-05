FROM node:22-alpine AS builder

WORKDIR /app

# Install Bun if not already present
RUN command -v bun > /dev/null 2>&1 || npm install -g bun

COPY package.json bun.lockb* ./
RUN bun install

COPY . .
RUN bunx tsc

# --- Production stage ---
FROM node:22-alpine

WORKDIR /app

# Install Bun if not already present
RUN command -v bun > /dev/null 2>&1 || npm install -g bun

COPY package.json bun.lockb* ./
RUN bun install --production

COPY --from=builder /app/dist ./dist

EXPOSE 3001

CMD ["node", "dist/index.js"]
