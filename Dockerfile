FROM node:latest

RUN apt update && apt install -y p7zip-full
#RUN apt install -y mongodb-clients
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6
RUN echo "deb http://repo.mongodb.org/apt/debian jessie/mongodb-org/3.4 main" | tee /etc/apt/sources.list.d/mongodb-org-3.4.list
RUN apt update && apt install -y mongodb-org-shell mongodb-org-tools

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# add `/usr/src/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# install and cache app dependencies
ADD package.json /usr/src/app/package.json
RUN npm install

COPY . .
EXPOSE 3000

# start app
CMD ["npm", "start"]
