FROM vnglst/pandoc-nodejs-docker

MAINTAINER Koen van Gilst <koen@koenvangilst.nl>

# Add app
ADD . /usr/src/app
WORKDIR /usr/src/app

# Install packages with YARN
RUN yarn

EXPOSE 8080
CMD [ "yarn", "start" ]
