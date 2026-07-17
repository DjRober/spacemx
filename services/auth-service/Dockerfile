FROM node:22-alpine

WORKDIR /app

# Copiamos primero el manifiesto: si no cambian las dependencias,
# Docker reutiliza la capa del npm ci y el build es casi instantáneo.
COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 3005
CMD ["npm", "start"]
