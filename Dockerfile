FROM node:lts as builder

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:lts-slim

ENV NODE_ENV production
USER node

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm ci --production

COPY --from=builder /usr/src/app/dist ./dist

ENV LOG_LEVEL=debug
ENV BOT_TOKEN=
ENV PGHOST=
ENV PGDATABASE=
ENV PGPORT=
ENV PGUSER=
ENV PGPASSWORD=

CMD [ "npm", "run", "start" ]
