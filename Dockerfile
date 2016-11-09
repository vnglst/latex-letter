FROM vnglst/pandoc-nodejs-docker

# Add custom fonts to system
ADD ./fonts /usr/share/fonts/opentype/
RUN fc-cache -f -v

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install yarn
RUN npm install -g yarn

# Install app dependencies
COPY package.json /usr/src/app/
RUN yarn

# Bundle app source
COPY . /usr/src/app

EXPOSE 3000

CMD [ "yarn", "start" ]
