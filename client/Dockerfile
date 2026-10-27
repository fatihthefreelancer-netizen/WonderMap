# --- WonderMap client (build then serve with nginx) ---
FROM node:20-alpine AS build

WORKDIR /app
COPY package.json package-lock.json ./
COPY shared/package.json ./shared/
COPY server/package.json ./server/
COPY client/package.json ./client/
RUN npm install --workspace client --workspace shared

COPY shared ./shared
COPY client ./client

ENV VITE_API_URL=/api
RUN npm --workspace client run build

# --- serve ---
FROM nginx:alpine
COPY client/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/client/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
