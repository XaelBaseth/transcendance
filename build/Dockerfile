#BUILD FRONT
FROM node:lts-alpine as build

RUN mkdir app
WORKDIR /app/

COPY frontend/package*.json ./
RUN npm install

COPY ./frontend /app/frontend

RUN npm run build --prefix ./frontend

#BUILD NGINX
FROM nginx:1.25.4

RUN rm -rf /var/www/html
RUN mkdir -p /etc/nginx/ssl

COPY --from=build /app/frontend/dist /var/www/html

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

COPY ./nginx/nginx_start.sh /etc/nginx/nginx_start.sh
RUN chmod +x /etc/nginx/nginx_start.sh

EXPOSE 8000

COPY ./nginx/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
CMD ["/entrypoint.sh"]
