#!/bin/bash

/etc/nginx/nginx_start.sh

exec nginx -g 'daemon off;'