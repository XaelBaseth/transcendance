MAKEFLAGS += --silent

# Color definitions
RESET		=	\033[0;39m
ORANGE		=	\033[0;33m
GRAY		=	\033[0;90m
RED			=	\033[0;91m
GREEN		=	\033[1;92m
YELLOW		=	\033[1;93m
BLUE		=	\033[0;94m
MAGENTA		=	\033[0;95m
CYAN		=	\033[0;96m
WHITE		=	\033[0;97m
BOLD		=	\033[1m
UNDERLINE	=	\033[4m

#RULES
all: build
	 $(MAKE) up
	 @echo "$(YELLOW)[TRANSCENDENCE] $(ORANGE)==>	$(GREEN)Website's up! go to \n\t\t$(BOLD)https://localhost:8000$(RESET)"

build: ## Setup the website by building the docker-compose.
	@$(MAKE) setup
	docker compose build

up: ## Start the website by starting the docker-compose.
	docker compose -f docker-compose.yml up -d

help: ## Print help on Makefile.
					@grep '^[^.#]\+:\s\+.*#' Makefile | \
					sed "s/\(.\+\):\s*\(.*\) #\s*\(.*\)/`printf "$(GRAY)"`\1`printf "$(DEF_COLOR)"`	\3 /" | \
					expand -t8
	
stop: ## Stop the website by stopping the docker-compose.
	docker compose -f docker-compose.yml stop

clean: ## Clean the website by stopping and removing the docker-compose.
	docker compose -f docker-compose.yml down -v

fclean: ## Clean the website by stopping and removing the docker-compose and all the volumes.
	$(MAKE) clean
	@chmod +x scripts/cleaner.sh
	./scripts/cleaner.sh
	docker system prune --force --volumes --all
	docker volume prune --all --force
	@echo "$(GREEN)[TRANSCENDENCE] $(ORANGE)==> $(GREEN)All clean, to make sure run $(BOLD)docker system df$(RESET)"

logs: ## Get the logs of the website.
	docker compose logs > .logs
	@echo "$(BLUE) You can now lookup the logs at $(BOLD).logs$(RESET)"

setup: ## Check if the .env file exists.
	if [ ! -f .env ]; then \
		echo "$(YELLOW)[TRANSCENDENCE] $(ORANGE)==> $(RED)No $(BOLD).env$(RESET)$(RED) file found. Please set one before attempting to build the website.$(RESET)" ;\
		exit 1; \
	fi
	./scripts/generate_cert.sh

.PHONY: all build up stop clean fclean logs setup
