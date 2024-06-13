#!/bin/bash

mv /etc/nginx/default.conf /etc/nginx/nginx.conf

exec nginx -g 'daemon off;'