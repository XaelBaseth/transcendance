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
	 @echo "$(YELLOW)[TRANSCENDENCE] $(ORANGE)===>	$(GREEN)Website's up! go to \n\t\t$(BOLD)https://localhost:8000$(RESET)"

build:
	@$(MAKE) setup
	./generate_cert.sh
	docker compose build

up:
	docker compose -f docker-compose.yml up -d
	
stop:
	docker compose -f docker-compose.yml stop

clean:
	docker compose -f docker-compose.yml down -v

fclean:
	$(MAKE) clean
	@chmod +x cleaner.sh
	./cleaner.sh
	docker system prune --force --volumes --all
	docker volume prune --all --force
	@echo "$(GREEN)[TRANSCENDENCE] $(ORANGE)==> $(GREEN)All clean, to make sure run $(BOLD)docker system df$(RESET)"

logs:
	docker compose logs > .logs
	@echo "$(BLUE) You can now lookup the logs at $(BOLD).logs$(RESET)"

setup:
	if [ ! -f .env ]; then \
		echo "$(YELLOW)[TRANSCENDENCE] $(ORANGE)==> $(RED)No $(BOLD).env$(RESET)$(RED) file found. Please set one before attempting to build the website.$(RESET)" ;\
		exit 1; \
	fi

.PHONY: all build up stop clean fclean logs setup