FROM node:12-alpine

WORKDIR /usr/src/sharesearch-user-service

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]