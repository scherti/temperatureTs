FROM node:10-buster AS node-tester
# set to development to install devDependencies
ENV NODE_ENV development

# install node modules prior to sources, so docker caching is able to kick in when packages are unchanged
COPY package*.json yarn.lock /app/
WORKDIR /app
#RUN yarn install --frozen-lockfile
RUN yarn install

FROM node-tester AS node-builder
ENV NODE_ENV development

COPY ./bin /app/bin
COPY ./src /app/src
COPY ./tsconfig.json /app/

RUN yarn build

FROM node:10-buster-slim
ENV NODE_ENV production

# Install required packages
RUN apt-get update && \
    apt-get install --yes --no-install-recommends \
            ca-certificates && \
    apt-get autoremove --yes && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src

COPY --from=node-builder /app/package.json /usr/src
COPY --from=node-builder /app/yarn.lock /usr/src
COPY --from=node-builder /app/bin /usr/src/bin

RUN yarn install --frozen-lockfile --production=true

COPY --from=node-builder /app/dist /usr/src/dist
#COPY --from=node-builder /app/src/app.js /usr/src/dist

EXPOSE 3000

#CMD ["ls", "-all"]
CMD ["npm", "run", "start"]
