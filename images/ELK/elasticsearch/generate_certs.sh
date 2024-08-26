#!/bin/bash
set -e

CERTS_DIR="/usr/share/elasticsearch/config/certs/"

mkdir -p ${CERTS_DIR}

# Generate the CA certificate and key
echo "Generating CA certificate..."
/usr/share/elasticsearch/bin/elasticsearch-certutil ca --out ${CERTS_DIR}/ca.p12 --pass ""

# Generate the server certificate signed by the CA
echo "Generating server certificate..."
/usr/share/elasticsearch/bin/elasticsearch-certutil cert --ca ${CERTS_DIR}/ca.p12 --ca-pass "" --out ${CERTS_DIR}/elastic-certificates.p12 --pass ""

# Verify the certificate generation
echo "Contents of ${CERTS_DIR}:"
ls -l ${CERTS_DIR}

if [ -f "${CERTS_DIR}/elastic-certificates.p12" ] && [ -f "${CERTS_DIR}/ca.p12" ]; then
    echo "Certificates successfully created in ${CERTS_DIR}."
    # Extract CA certificate from the CA PKCS#12 file
    openssl pkcs12 -in "${CERTS_DIR}/ca.p12" -cacerts -out ${CERTS_DIR}/ca-certificates.pem -nokeys -passin pass:""
else
    echo "Failed to create certificates in ${CERTS_DIR}."
    exit 1
fi

# Ensure the certificates are present in the expected location
if [ ! "$(ls -A ${CERTS_DIR})" ]; then
  echo "Certificates not found in ${CERTS_DIR}. Exiting."
  exit 1
fi

chmod 0644 ${CERTS_DIR}/*

# Verify the certificate generation
echo "Contents of ${CERTS_DIR}:"
ls -l "${CERTS_DIR}"
