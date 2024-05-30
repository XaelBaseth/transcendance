#!/bin/bash

set -ex

CERTS_DIR="./ssl/certs"
PRIVATE_KEY_DIR="./ssl/private"


mkdir -p "$CERTS_DIR" "$PRIVATE_KEY_DIR"

if [! -f "${CERTS_DIR}/nginx.crt" ]; then
    openssl req -x509 -nodes -days 365 -newkey rsa:4096 \
        -keyout "${PRIVATE_KEY_DIR}/nginx.key" \
        -out "${CERTS_DIR}/nginx.crt" \
        -subj "/C=FR/O=42LeHavre/CN=www.transcendance.ff"
fi


#!/bin/bash

# Debug option
#set -ex

CERTS_DIR="./ssl/certs"
PRIVATE_KEY_DIR="./ssl/private"

mkdir -p "$CERTS_DIR" "$PRIVATE_KEY_DIR"

# Generate the CA certificate
if [ ! -f "${CERTS_DIR}/ca.crt" ]; then
    openssl req -new -x509 -days 3650 -keyout "${PRIVATE_KEY_DIR}/ca.key" -out "${CERTS_DIR}/ca.crt" -nodes \
        -subj "/C=FR/O=42LeHavre/CN=transcendance-ca"
else
    printf "\033[1;92mCA certificate is already present.\033[0;39m\n"
fi

# Generate the server certificate
if [ ! -f "${CERTS_DIR}/vault.crt" ]; then
    openssl req -new -nodes -newkey rsa:4096 -keyout "${PRIVATE_KEY_DIR}/vault.key" -out "${CERTS_DIR}/vault.csr" \
        -subj "/C=FR/O=42LeHavre/CN=www.transcendance.ff" \
        -addext "subjectAltName=DNS:vault,DNS:localhost,DNS:www.transcendance.ff"

    openssl x509 -req -days 365 -in "${CERTS_DIR}/vault.csr" -CA "${CERTS_DIR}/ca.crt" -CAkey "${PRIVATE_KEY_DIR}/ca.key" \
        -CAcreateserial -out "${CERTS_DIR}/vault.crt" -extfile <(printf "subjectAltName=DNS:vault,DNS:localhost,DNS:www.transcendance.ff")

#Give the correct rights to the file.
    chmod 644 ${PRIVATE_KEY_DIR}/ca.key
    chmod 644 ${PRIVATE_KEY_DIR}/vault.key
else
    printf "\033[1;92mServer certificate is already present.\n"
fi
