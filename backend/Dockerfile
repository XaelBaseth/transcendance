FROM python:3.12

RUN mkdir /app

COPY ./backend /app/backend
WORKDIR /app/backend

RUN apt-get update \
	&& apt-get install -y --no-install-recommends postgresql-client\
	&& rm -rf /var/lib/apt/lists/*

RUN pip install --upgrade pip\
	&& pip install --no-cache-dir -r requirements.txt

EXPOSE 8000

RUN chmod +x /app/backend/init.sh

ENTRYPOINT ["/app/backend/init.sh"]

CMD python3 manage.py makemigrations \
	&& python3 manage.py migrate \
	&& daphne -b 0.0.0.0 -p 8000 source.asgi:application