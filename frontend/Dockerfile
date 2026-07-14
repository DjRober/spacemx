FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# --host expone Vite fuera del contenedor; sin esto solo escucha en
# 127.0.0.1 (dentro del contenedor) y el navegador no lo alcanza.
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
