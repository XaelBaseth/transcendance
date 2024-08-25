#!/bin/bash
set -e

CERTS_DIR="/usr/share/elasticsearch/config/certs/"

# Generate the CA certificate and key
echo "Generating CA certificate..."
/usr/share/elasticsearch/bin/elasticsearch-certutil ca --out ${CERTS_DIR}/ca.p12 --pass ""

# Generate the server certificate signed by the CA
echo "Generating server certificate..."
/usr/share/elasticsearch/bin/elasticsearch-certutil cert --ca ${CERTS_DIR}/ca.p12 --out ${CERTS_DIR}/elastic-certificates.p12 --pass ""

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
# End of snippet