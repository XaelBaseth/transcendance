#!/bin/bash

# Source the environment variables
. /vault/file/env_vars.sh

export $(grep -v '^#' /vault/file/env_vars.sh)

exec "$@"