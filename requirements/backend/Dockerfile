FROM	node:14

COPY	package*.json ./
# please create package.json for all necessary packages
RUN		npm install
RUN		npm install -g @nestjs/cli
EXPOSE	3000
CMD		[ "npm", "run", "start" ]