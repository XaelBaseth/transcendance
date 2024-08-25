#!/bin/bash
set -e

CERTS_DIR="/usr/share/elasticsearch/config/certs"

# Run the certificate generation script
echo "Running certificate generation script..."
/usr/share/elasticsearch/scripts/generate_certs.sh

# Verify the certificate generation
echo "Contents of ${CERTS_DIR}:"
ls -l ${CERTS_DIR}

if [ -f "${CERTS_DIR}/elastic-certificates.p12" ]; then
	echo "Certificate successfully created in ${CERTS_DIR}."
	openssl pkcs12 -in "${CERTS_DIR}/elastic-certificates.p12 -cacerts -out ${CERTS_DIR}/ca-certificates.pem -nokeys
else
	echo "Failed to create certificate in ${CERTS_DIR}."
	exit 1
fi

# Start Elasticsearch
exec /usr/local/bin/docker-entrypoint.sh
