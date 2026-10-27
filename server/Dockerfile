# --- WonderMap API ---
FROM node:20-alpine

WORKDIR /app

# Workspace manifests first for better layer caching
COPY package.json package-lock.json ./
COPY shared/package.json ./shared/
COPY server/package.json ./server/
COPY client/package.json ./client/

# Install only what the server needs (workspaces resolve shared locally)
RUN npm install --omit=dev --workspace server --workspace shared || npm install --workspace server --workspace shared

COPY shared ./shared
COPY server ./server

ENV NODE_ENV=production
EXPOSE 4000

CMD ["npm", "--workspace", "server", "run", "start"]
