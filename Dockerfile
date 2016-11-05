FROM node:latest

RUN apt-get update && apt-get install -y texlive-base texlive-xetex biber latexmk make pandoc
RUN pandoc

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
RUN npm install -g yarn
COPY package.json /usr/src/app/
RUN yarn

# Bundle app source
COPY . /usr/src/app

EXPOSE 3000
CMD [ "yarn", "start" ]
