#!/bin/bash

set -e

# Start Vault server in the background
vault server -config=/vault/config/vault-config.hcl &

# Wait until Vault is ready
echo "Waiting for Vault to be ready..."
until curl -s --insecure https://127.0.0.1:8200/v1/sys/health > /dev/null; do
  echo "Vault is not ready yet..."
  sleep 5
done

# Initialize Vault if not already initialized
if [ ! -f /vault/init_output.txt ]; then
  echo "Initializing Vault..."
  vault operator init -key-shares=1 -key-threshold=1 > /vault/init_output.txt
  grep 'Unseal Key 1:' /vault/init_output.txt | awk '{print $NF}' > /vault/unseal_key.txt
fi

# Unseal Vault
echo "Unsealing Vault..."
vault operator unseal $(cat /vault/unseal_key.txt)

# Verify if Vault is unsealed
if vault status | grep -q "Sealed: false"; then
  echo "Vault has been successfully unsealed."
else
  echo "Error: Vault did not unseal successfully."
  exit 1
fi

# Keep the container running
tail -f /dev/null
