#!/bin/bash

#Debug option
set -ex

CERTS_DIR="./ssl/certs"
PRIVATE_KEY_DIR="./ssl/private"

mkdir -p "$CERTS_DIR" "$PRIVATE_KEY_DIR"

if [ ! -f "${CERTS_DIR}/nginx.crt" ]; then
    openssl req -x509 -nodes -days 365 -newkey rsa:4096 \
        -keyout "${PRIVATE_KEY_DIR}/nginx.key" \
        -out "${CERTS_DIR}/nginx.crt" \
        -subj "/C=FR/O=42LeHavre/CN=www.transcendance.ff" \
        -addext "subjectAltName=DNS:vault,DNS:localhost,DNS:www.transcendance.ff"
else
    echo "Certificates are already present."
fi
