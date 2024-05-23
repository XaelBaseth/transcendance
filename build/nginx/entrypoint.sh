#!/bin/bash

mv /etc/nginx/default.conf /etc/nginx/nginx.conf
/etc/nginx/nginx_start.sh

exec nginx -g 'daemon off;'