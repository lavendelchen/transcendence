FROM	node:14

COPY	package*.json ./
RUN		npm install
COPY	./app ./app
RUN		npm run build
EXPOSE	80
EXPOSE	443