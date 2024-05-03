all: build
	 $(MAKE) up
	 @echo "website's up! go to https://localhost:8000"

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
	docker volume prune --all --force
	@echo "All clean, to make sure run <docker system df>!"

logs:
	docker compose logs >> .logs

.PHONY: all build up stop clean fclean logs