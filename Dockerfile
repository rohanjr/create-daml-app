# This file is based on https://github.com/timbru31/docker-java-node.
FROM openjdk:8-jre-slim-buster

ENV DAML_SDK_VERSION=0.13.32

RUN apt-get update -qq && apt-get install -qq --no-install-recommends \
  curl \
  gnupg2 \
  netcat

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

# Install node.js 12.x & yarn
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update -qq && apt-get install -qq --no-install-recommends \
  nginx \
  nodejs \
  yarn \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

# Install DAML SDK
RUN curl https://get.daml.com | sh -s $DAML_SDK_VERSION && rm -rf /tmp/*
ENV PATH="/root/.daml/bin:${PATH}"

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build
RUN cp nginx.conf /etc/nginx/sites-available/default

EXPOSE 80

CMD ["./docker-entrypoint.sh"]
