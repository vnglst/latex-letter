FROM strages/pandoc-docker

RUN apt-get update && apt-get install -y git git-core curl
RUN apt-get install -y nodejs npm
RUN ln -s /usr/bin/nodejs /usr/bin/node
RUN ln -s /usr/local/bin/node /usr/local/bin/nodejs

# Adding app
ADD . /usr/src/app
WORKDIR /usr/src/app

# Adding fonts to system
ADD ./fonts /usr/share/fonts/opentype/
RUN fc-cache -f -v

# Installing latest node
RUN npm install n -g
RUN n latest

# Installing yarn
RUN npm install -g yarn
RUN yarn

EXPOSE 3000
CMD [ "yarn", "start" ]
