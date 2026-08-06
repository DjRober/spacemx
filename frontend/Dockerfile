# ── Etapa 1: build del SPA ──────────────────────────────────────
# Node solo se necesita para compilar; no queda en la imagen final.
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build          # genera /app/dist (HTML/CSS/JS estáticos)

# ── Etapa 2: nginx sirve los estáticos + reverse proxy ──────────
# La imagen final es solo nginx + los archivos del build: ligera y sin Node.
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
# La imagen de nginx ya arranca el servidor en foreground por defecto.
