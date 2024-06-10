FROM node:alpine3.20

RUN mkdir -p /app
WORKDIR /app
COPY . .
RUN npm install 

ENTRYPOINT [ "node", "server.js"]