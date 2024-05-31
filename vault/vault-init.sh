#!/usr/bin/env sh

#Debug option
set -ex

unseal () {
vault operator unseal $(grep 'Key 1:' /vault/file/keys | awk '{print $NF}')
vault operator unseal $(grep 'Key 2:' /vault/file/keys | awk '{print $NF}')
vault operator unseal $(grep 'Key 3:' /vault/file/keys | awk '{print $NF}')
}

init () {
vault operator init > /vault/file/keys
sleep 2
}

log_in () {
   export ROOT_TOKEN=$(grep 'Initial Root Token:' /vault/file/keys | awk '{print $NF}')
   vault login $ROOT_TOKEN
}

create_token () {
   vault token create -id $MY_VAULT_TOKEN
}

store_env () {
	vault kv put secret/transcendence/postgresql_credentials DB_NAME=$POSTGRES_DB DB_USERNAME=$POSTGRES_USER \
		DB_PASSWORD=$POSTGRES_PASSWORD DB_HOST_NAME=$DATABASE_HOST_NAME DB_PORT=$DATABASE_PORT
	vault kv put secret/transcendence/backend_credentials SECRET_KEY=$SECRET_KEY
	vault kv put secret/transcendence/front_credentials API_KEY=$VITE_API_URL
}

if [ -s /vault/file/keys ]; then
   unseal
else
   init
   unseal
   log_in
   create_token
fi

store_env

vault status > /vault/file/status
