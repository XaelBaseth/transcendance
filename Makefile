up:
	@echo "Make sure you have your certificates"
	@if [ ! -f .env ]; then echo "No .env file, please add one" && exit; fi; 
	@cp -u .env frontend/.env; 
	docker compose up --build

down:
	docker compose down

fclean: down
	@docker system prune -af
	@docker network prune -f

re:	fclean up