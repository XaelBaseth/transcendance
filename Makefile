all: build
	 $(MAKE) up

build:
	docker compose build

up:
	docker compose -f docker-compose.yml up -d
	
stop:
	docker compose -f docker-compose.yml stop

clean:
	docker compose -f docker-compose.yml down -v

fclean:
	$(MAKE) clean
	docker system prune --force --volumes --all

.PHONY: all build up stop clean fclean