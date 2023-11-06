FROM	node:18.18

WORKDIR	/app

COPY	setup.sh /bin/
RUN		chmod +x /bin/setup.sh

EXPOSE	5173

CMD		npm install && npm run dev