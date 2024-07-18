#!/bin/sh

printf "\033[0;33mStarting the cleaning session!\033[0m\n"
rm -rf ./volume/vault-data
sleep 1
docker run --rm -v $(pwd):/app -w /app alpine rm -rf ./volume/db_data
sleep 1
rm -rf ./ssl/*
printf "\033[0;32mCleaning session done! Enjoy your clean reboot!\033[0m\n"