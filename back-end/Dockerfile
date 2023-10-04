FROM node:20.5.0

EXPOSE 3000

WORKDIR /app

COPY package*.json ./

RUN npm install

CMD [ "npm", "run", "start:dev"]
