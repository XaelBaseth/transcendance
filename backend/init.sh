#!/bin/bash

# Source the environment variables
. /env_vars.sh

 # Export the variables to make them available in the environment
 export $(grep -v '^#' /env_vars.sh)

exec "$@"