all: build
	docker compose up -d

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

re: stop clean build

.PHONY: all build up stop clean fclean re