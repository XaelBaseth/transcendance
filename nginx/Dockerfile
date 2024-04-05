FROM node:lts-alpine as build

RUN mkdir /app

COPY ./frontend /app/frontend

WORKDIR /app/frontend

RUN npm update
RUN npm install
RUN npm run build
FROM nginx:1.25.3

RUN rm -rf /var/www/html
RUN mkdir -p /etc/nginx/ssl

COPY --from=build /app/frontend/build /var/www/html
COPY --from=build  /app/frontend/build/static/css /var/www/html

COPY ./nginx/nginx_https.conf /etc/nginx/nginx_https.conf

COPY ./nginx/nginx_start.sh /etc/nginx/nginx_start.sh
RUN chmod +x /etc/nginx/nginx_start.sh

EXPOSE 8000

COPY ./nginx/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
CMD ["/entrypoint.sh"]