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

CMD ["sh", "/app/backend/init.sh"]