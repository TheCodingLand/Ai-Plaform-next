

FROM node:alpine as build-deps
WORKDIR /usr/src/app
COPY package.json ./
RUN npm i
ADD . /usr/src/app

CMD npm start