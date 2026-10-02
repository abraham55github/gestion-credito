# --- Etapa de build: compila el Angular en modo producción ---
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration production

# --- Etapa final: nginx sirviendo los archivos estáticos ---
FROM nginx:alpine

COPY --from=build /app/dist/gestion-credito/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
