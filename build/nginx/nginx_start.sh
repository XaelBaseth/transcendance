#!/bin/bash

if [ ! -f /certs/nginx.crt ]; then
        openssl req -x509 -nodes -days 365 -newkey rsa:4096 -keyout /private/nginx.key -out /certs/nginx.crt -subj "/C=FR/O=42LeHavre/CN=wwww.transcendance.ff";
fi

exec "$@"