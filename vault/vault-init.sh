#!/usr/bin/env sh

# Debug option
#set -ex

unseal() {
    vault operator unseal "$(grep 'Key 1:' /vault/file/keys | awk '{print $NF}')"
    vault operator unseal "$(grep 'Key 2:' /vault/file/keys | awk '{print $NF}')"
    vault operator unseal "$(grep 'Key 3:' /vault/file/keys | awk '{print $NF}')"
}

init() {
    vault operator init > /vault/file/keys
    sleep 5
}

log_in() {
    export ROOT_TOKEN=$(grep 'Initial Root Token:' /vault/file/keys | awk '{print $NF}')
    vault login "$ROOT_TOKEN"
}

create_token() {
    vault token create -id "$MY_VAULT_TOKEN"
}

create_approles() {
    vault auth enable approle
    echo 'path "secret/data/django/*" { capabilities = ["create", "update", "read", "delete"] }' | vault policy write django-backend -
    vault write auth/approle/role/django-backend token_policies=django-backend
    echo 'path "secret/data/react/*" { capabilities = ["create", "update", "read", "delete"] }' | vault policy write react-frontend -
    vault write auth/approle/role/react-frontend token_policies=react-frontend

    DJANGO_ROLE_ID=$(vault read -field=role_id auth/approle/role/django-backend/role-id)
    REACT_ROLE_ID=$(vault read -field=role_id auth/approle/role/react-frontend/role-id)

    DJANGO_SECRET_ID=$(vault write -f -field=secret_id auth/approle/role/django-backend/secret-id)
    REACT_SECRET_ID=$(vault write -f -field=secret_id auth/approle/role/react-frontend/secret-id)

    echo "DJANGO_ROLE_ID=$DJANGO_ROLE_ID" >> /vault/file/env_vars.sh
    echo "REACT_ROLE_ID=$REACT_ROLE_ID" >> /vault/file/env_vars.sh
    echo "DJANGO_SECRET_ID=$DJANGO_SECRET_ID" >> /vault/file/env_vars.sh
    echo "REACT_SECRET_ID=$REACT_SECRET_ID" >> /vault/file/env_vars.sh
}

store_env() {
    vault secrets enable -path=secret kv-v2

    vault kv put secret/django DB_NAME="$POSTGRES_DB" DB_USERNAME="$POSTGRES_USER" \
        DB_PASSWORD="$POSTGRES_PASSWORD" DB_HOST_NAME="$DATABASE_HOST_NAME" \
		DB_PORT="$DATABASE_PORT" SECRET_KEY="$SECRET_KEY"
    vault kv put secret/react API_KEY="$VITE_API_URL"
}

if [ -s /vault/file/keys ]; then
    unseal
else
    init
    unseal
    log_in
    create_token
    create_approles
    store_env
fi

vault status > /vault/file/status
