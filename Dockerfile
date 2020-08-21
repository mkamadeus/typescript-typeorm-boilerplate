FROM node:12

WORKDIR /app

COPY package.json /app
RUN npm install
EXPOSE 3000
