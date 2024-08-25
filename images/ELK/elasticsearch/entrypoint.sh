#!/bin/bash
set -e

CERTS_DIR="/usr/share/elasticsearch/config/certs/"

# Ensure the certificates are present in the expected location
if [ ! "$(ls -A ${CERTS_DIR})" ]; then
  echo "Certificates not found in ${CERTS_DIR}. Exiting."
  exit 1
fi

# Verify the certificate generation
echo "Contents of ${CERTS_DIR}:"
ls -l "${CERTS_DIR}"

# Start Elasticsearch
echo "Starting Elasticsearch..."
/usr/local/bin/docker-entrypoint.sh &

# Wait for Elasticsearch to be fully up and running
echo "Waiting for Elasticsearch to be ready..."
until curl -u ${ELASTIC_USERNAME}:${ELASTIC_PASSWORD} -s -XGET "https://localhost:9200/_cluster/health?wait_for_status=yellow&timeout=50s" \
	--cacert ${CERTS_DIR}/http_ca.crt | grep -q '"status":"yellow"'; do
  sleep 5
done

# Setup Index Lifecycle Management (ILM) policy
echo "Creating ILM policy..."
curl -u ${ELASTIC_USERNAME}:${ELASTIC_PASSWORD} -X PUT "https://localhost:9200/_ilm/policy/logs_policy" --cacert ${CERTS_DIR}/http_ca.crt \
	-H 'Content-Type: application/json' -d'
{
  "phases": {
    "hot": {
      "actions": {
        "rollover": {
          "max_size": "50gb",
          "max_age": "1d"
        }
      }
    },
    "warm": {
      "actions": {
        "forcemerge": {
          "max_num_segments": 1
        },
        "readonly": {}
      }
    },
    "delete": {
      "min_age": "30d",
      "actions": {
        "delete": {}
      }
    }
  }
}'

# Setup Snapshot Repository
echo "Creating snapshot repository..."
curl -u ${ELASTIC_USERNAME}:${ELASTIC_PASSWORD} -X PUT "https://localhost:9200/_snapshot/my_backup" --cacert ${CERTS_DIR}/http_ca.crt \
	 -H 'Content-Type: application/json' -d'
{
  "type": "fs",
  "settings": {
    "location": "/usr/share/elasticsearch/config/volume/snapshots",
    "compress": true
  }
}'

# Wait for Elasticsearch process to complete
wait
