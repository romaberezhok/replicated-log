FROM node:18-alpine

ENV NODE_TYPE=MASTER

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "app.js"]