#!/bin/bash

# Initialize Vault
exec vault operator init > /vault/init_output.txt

# Extract unseal keys from the initialization output
UNSEAL_KEYS=$(grep "Unseal Key" /vault/init_output.txt | tail -n +2 | head -n -1)
echo $UNSEAL_KEYS > /vault/unseal_keys.txt

# Perform unsealing
for KEY in $(cat /vault/unseal_keys.txt); do
  exec vault operator unseal $KEY
done

# Check if Vault is unsealed
if exec vault status | grep -q "Sealed"; then
  echo "Error: Vault did not unseal successfully."
  exit 1
else
  echo "Vault has been successfully unsealed."
fi

# Start Vault server
exec vault server
