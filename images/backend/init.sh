#!/bin/bash

# Source the environment variables
. /vault/file/env_vars.sh

export $(grep -v '^#' /vault/file/env_vars.sh)

# Run migrations
python3 manage.py makemigrations --noinput
python3 manage.py migrate --noinput

# Check if a superuser already exists
if [ -z "$(python3 manage.py shell -c "from django.contrib.auth import get_user_model; print(get_user_model().objects.filter(username='$DJANGO_SUPERUSER_USERNAME').exists())")" ]; then
    # If the superuser does not exist, create it
    python3 manage.py createsuperuser --noinput \
	--username $DJANGO_SUPERUSER_USERNAME --email $DJANGO_SUPERUSER_EMAIL
fi

# Start Daphne server
daphne -b 0.0.0.0 -p 8000 source.asgi:application
