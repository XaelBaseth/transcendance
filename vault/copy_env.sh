#!/bin/bash

# Check if Vault is initialized and unsealed
vault status

# Login to Vault
vault login $MY_VAULT_TOKEN


