#!/bin/bash

# Debug option
set -ex

CERTS_DIR="./ssl/certs"
PRIVATE_KEY_DIR="./ssl/private"

mkdir -p "$CERTS_DIR" "$PRIVATE_KEY_DIR"

# Generate the CA certificate
if [ ! -f "${CERTS_DIR}/ca.crt" ]; then
    openssl req -new -x509 -days 3650 -keyout "${PRIVATE_KEY_DIR}/ca.key" -out "${CERTS_DIR}/ca.crt" -nodes \
        -subj "/C=FR/O=42LeHavre/CN=transcendance-ca"
else
    echo "CA certificate is already present."
fi

# Generate the server certificate
if [ ! -f "${CERTS_DIR}/vault.crt" ]; then
    openssl req -new -nodes -newkey rsa:4096 -keyout "${PRIVATE_KEY_DIR}/vault.key" -out "${CERTS_DIR}/vault.csr" \
        -subj "/C=FR/O=42LeHavre/CN=www.transcendance.ff" \
        -addext "subjectAltName=DNS:vault,DNS:localhost,DNS:www.transcendance.ff"

    openssl x509 -req -days 365 -in "${CERTS_DIR}/vault.csr" -CA "${CERTS_DIR}/ca.crt" -CAkey "${PRIVATE_KEY_DIR}/ca.key" \
		 -CAcreateserial -out "${CERTS_DIR}/vault.crt" -extfile <(printf "subjectAltName=DNS:vault,DNS:localhost,DNS:www.transcendance.ff")
else
    echo "Server certificate is already present."
fi
