FROM node

RUN apt-get update
RUN apt-get install nginx -y

RUN npm install -g yarn

RUN yarn global add webpack
RUN yarn global add webpack-cli
RUN yarn global add webpack-dev-server

RUN mkdir -p /opt
WORKDIR /opt
ADD package.json /opt/package.json

RUN yarn install

RUN mkdir -p /run/nginx

COPY bootstrap.sh /opt/
RUN chmod u+x /opt/bootstrap.sh

CMD bash /opt/bootstrap.sh