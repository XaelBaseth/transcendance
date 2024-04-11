FROM python:3.9

RUN mkdir /app

COPY . /app/backend
WORKDIR /app/backend

RUN apt-get update \
    && apt-get install -y --no-install-recommends postgresql-client\
    && rm -rf /var/lib/apt/lists/*

RUN pip install --upgrade pip\
    && pip install --no-cache-dir -r requirements.txt

EXPOSE 8000

CMD python3 manage.py makemigrations && python3 manage.py migrate && python3 manage.py runserver 0.0.0.0:8000