# Build context is the monorepo root so we can use the shared lockfile.
FROM node:22-alpine

WORKDIR /app/backend

# Install all workspace dependencies from the root lockfile.
COPY package.json package-lock.json ../
COPY frontend/package.json ../frontend/package.json
COPY backend/package.json ./
RUN npm ci

# Build the backend (tsc -> dist).
COPY backend/tsconfig.json ./tsconfig.json
COPY backend/src ./src
RUN npm run build

EXPOSE 3001
CMD ["node", "dist/server.js"]
