FROM node:22-alpine

WORKDIR /app

# Install Bun if not already present
RUN command -v bun > /dev/null 2>&1 || npm install -g bun

COPY package.json bun.lockb* ./
RUN bun install

COPY . .

EXPOSE 3210

CMD ["bun", "index.ts"]
