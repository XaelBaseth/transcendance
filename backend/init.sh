#!/bin/bash

# Source the environment variables
. /vault/file/env_vars.sh

 echo "DJANGO_ROLE_ID=$DJANGO_ROLE_ID"
 echo "REACT_ROLE_ID=$REACT_ROLE_ID"
 echo "DJANGO_SECRET_ID=$DJANGO_SECRET_ID"
 echo "REACT_SECRET_ID=$REACT_SECRET_ID"

 # Export the variables to make them available in the environment
export $(grep -v '^#' /vault/file/env_vars.sh)

exec "$@"