FROM vnglst/pandoc-nodejs-docker

MAINTAINER Koen van Gilst <koen@koenvangilst.nl>

# Adding app
ADD . /usr/src/app
WORKDIR /usr/src/app

# Installing packages with YARN
RUN yarn

EXPOSE 3000
CMD [ "yarn", "start" ]
