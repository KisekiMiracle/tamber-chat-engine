FROM node:22-alpine AS builder

WORKDIR /app

# Install Bun if not already present
RUN command -v bun > /dev/null 2>&1 || npm install -g bun

COPY package*.json ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

# --- Production stage ---
FROM node:22-alpine

WORKDIR /app

# Install Bun if not already present
RUN command -v bun > /dev/null 2>&1 || npm install -g bun

COPY package*.json ./
RUN bun install --frozen-lockfile --production

COPY --from=builder /app/dist ./dist

EXPOSE 3001

CMD ["node", "dist/index.js"]
