#!/bin/bash
#set -ex

. /vault/file/env_vars.sh

export $(grep -v '^#' /vault/file/env_vars.sh)

RESPONSE=$(curl --silent --request POST --cacert /etc/ssl/certs/ca.crt --data '{"role_id":"'"$REACT_ROLE_ID"'", "secret_id":"'"$REACT_SECRET_ID"'"}' \
$VAULT_ADDR/v1/auth/approle/login)
VAULT_TOKEN=$(echo $RESPONSE | jq -r .auth.client_token)
export VAULT_TOKEN

if [ -z "$VAULT_TOKEN" ]; then
echo "Failed to obtain Vault token. Exiting."
exit 1
fi

SECRET_RESPONSE=$(curl --silent --cacert /etc/ssl/certs/ca.crt --header "X-Vault-Token: $VAULT_TOKEN" \
	$VAULT_ADDR/v1/secret/data/react)

VITE_API_URL=$(echo $SECRET_RESPONSE | jq -r '.data.data.VITE_API_URL')

exec "$@"
