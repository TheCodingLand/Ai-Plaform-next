# FROM ubuntu:latest

# RUN apt-get update
# RUN apt-get install -yq curl git nano
# RUN apt-get install -y npm
# RUN npm install -g npm
# RUN curl -sL https://deb.nodesource.com/setup_9.x | bash -
# RUN apt-get install -y nodejs
# RUN npm install -g http-server

# RUN mkdir -p /usr/src/app

# RUN npm install npm@latest -g
# RUN npm install express
# WORKDIR /usr/src/app
# ADD package.json /usr/src/app/package.json
# ADD package-lock.json /usr/src/app/package-lock.json
# RUN npm install
# COPY . /usr/src/app/

# RUN npm run build
# RUN mkdir -p /usr/app/www/
# RUN yes | cp -rf /usr/src/app/build/* /usr/app/www/

# WORKDIR /usr/app/www/
# #CMD ["npm", "start"]

# CMD ["node", "/usr/src/app/src/server.js"]



# Stage 1 - the build process
FROM node:alpine as build-deps
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm i
ADD . /usr/src/app

RUN npm run build

# Stage 2 - the production environment
FROM nginx:alpine
COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html
ADD ./nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]