#!/usr/bin/env sh

# Source environment variables
source /vault/file/env_vars.sh

# Start Vault
vault server -config=/vault/config/config.hcl
