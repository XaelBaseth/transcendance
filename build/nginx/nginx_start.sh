#!/bin/bash

if [ ! -f /etc/ssl/certs/nginx.crt ]; then
        openssl req -x509 -nodes -days 365 -newkey rsa:4096 -keyout /etc/ssl/private/nginx.key -out /etc/ssl/certs/nginx.crt -subj "/C=FR/O=42LeHavre/CN=wwww.transcendance.ff";
fi    

exec "$@"