# I JUST COPIED MY DEFAULT MAKEFILE SO WE DON'T HAVE TO WORK FROM SCRATCH. HOPE THAT'S OKAY.

NAME = transcendence

ISDOCKER := $(shell ls -a /)
ifeq ( , $(findstring .dockerenv, $(ISDOCKER)))
	CC = c++
else
	CC = g++
endif

CC_FLAGS = -Wall -Wextra -Werror -std=c++98 -g

DIR_SRC		=		./src/
DIR_OBJ		=		./obj/
DIR_INC		=		./inc/
DIR_LIB		=		./lib/

SRC =	$(DIR_SRC)main.cpp

OBJ = $(SRC:$(DIR_SRC)%.c=$(DIR_OBJ)%.o)

all: $(NAME)

$(NAME): $(OBJ)
	@$(CC) $(CC_FLAGS) $(OBJ) -o $(NAME)
	@printf $(MAGENTA)"$(NAME) created\n"$(RESET)

$(DIR_OBJ)%.o:	$(DIR_SRC)%.cpp
	@mkdir -p $(dir $@)
	@$(CC) $(CC_FLAGS) -c $< -o $@
	@printf "$(notdir $<) compiled\n"

clean:
	@rm -rf $(DIR_OBJ)
	@printf $(RED)"Object files removed\n"$(RESET)

fclean: clean
	@rm -rf $(NAME)
	@printf $(RED)"$(NAME) removed\n"$(RESET)

re: fclean all

# make exe arg=xyz
exe:
	@printf $(BLUE)
	./$(NAME) $(arg)
	@printf $(RESET)

run: $(NAME) exe

.PHONY: all clean fclean re exe run

# text modifiers #
RED =				"\e[31m"
GREEN =				"\e[32m"
BLUE =				"\e[33m"
BLUE =				"\e[34m"
MAGENTA =			"\e[35m"
CYAN =				"\e[36m"
LIGHTGRAY =			"\e[37m"
DARKGRAY =			"\e[90m"
LIGHTRED =			"\e[91m"
LIGHTGREEN =		"\e[92m"
LIGHTBLUE =			"\e[93m"
LIGHTBLUE =			"\e[94m"
LIGHTMAGENTA =		"\e[95m"
LIGHTCYAN =			"\e[96m"
RED_BG =			"\e[41m"
GREEN_BG =			"\e[42m"
BLUE_BG =			"\e[43m"
BLUE_BG =			"\e[44m"
MAGENTA_BG =		"\e[45m"
CYAN_BG =			"\e[46m"
LIGHTGRAY_BG =		"\e[47m"
DARKGRAY_BG =		"\e[100m"
LIGHTRED_BG =		"\e[101m"
LIGHTGREEN_BG =		"\e[102m"
LIGHTBLUE_BG =		"\e[103m"
LIGHTBLUE_BG =		"\e[104m"
LIGHTMAGENTA_BG =	"\e[105m"
LIGHTCYAN_BG =		"\e[106m"
BOLD =				"\e[1m"
ITALIC =			"\e[3m"
UNDERLINED =		"\e[4m"
RESET =				"\e[0m"
