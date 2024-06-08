#!/bin/bash

# Source the environment variables
./env_vars.sh

export DJANGO_ROLE_ID
export DJANGO_SECRET_ID

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Start the Django application
exec daphne -b 0.0.0.0 -p 8000 source.asgi:application