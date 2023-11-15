FROM	node:18.18

EXPOSE	5173

WORKDIR	/app

COPY	package*.json ./

RUN		npm install

CMD [ "npm", "run", "dev"]
