#!/usr/bin/env sh

#Debug option
#set -ex

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
	echo "export VAULT_TOKEN='${ROOT_TOKEN}'" >> /vault/file/env_vars.sh
}

create_token () {
	vault token create -id $MY_VAULT_TOKEN
	echo "export MY_VAULT_TOKEN='${MY_VAULT_TOKEN}'" >> /vault/file/env_vars.sh
}

if [ -s /vault/file/keys ]; then
	unseal
else
	init
	unseal
	log_in
	create_token
fi

vault status > /vault/file/status
