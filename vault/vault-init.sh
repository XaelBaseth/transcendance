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
	export VAULT_TOKEN=$ROOT_TOKEN # Add this line to ensure the VAULT_TOKEN env var is set
}

create_token () {
	vault token create -id $MY_VAULT_TOKEN
}

store_env () {
	paths=("secret/transcendence/postgresql_credentials"
		"secret/transcendence/backend_credentials"
		"secret/transcendence/frontend_credentials"
	)

	for path in "${paths[@]}"; do
		if vault kv get "$path" > /dev/null 2>&1; then
			echo "Path $path is already in use. Disabling..."
			vault secrets disable "$path"
		fi
		vault secrets enable -path="$path" kv
	done

	vault kv put secret/transcendence/postgresql_credentials DB_NAME="$POSTGRES_DB" DB_USERNAME="$POSTGRES_USER" \
		DB_PASSWORD="$POSTGRES_PASSWORD" DB_HOST_NAME="$DATABASE_HOST_NAME" DB_PORT="$DATABASE_PORT"
	vault kv put secret/transcendence/backend_credentials SECRET_KEY="$SECRET_KEY"
	vault kv put secret/transcendence/front_credentials API_KEY="$VITE_API_URL"
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
