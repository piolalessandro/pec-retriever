FROM node:12

# Create app directory
WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn
RUN yarn build

COPY . .

ENV NODE_ENV production

EXPOSE 8080
CMD [ "node", "server.js" ]
USER node