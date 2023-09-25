FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ENV NODE_TYPE=MASTER

EXPOSE 3000

CMD ["node", "app.js"]