FROM mhart/alpine-node:12 as base

WORKDIR /usr/src

COPY . .
RUN npm install
RUN npm run build

FROM mhart/alpine-node:slim-12

WORKDIR /usr/src

# GraphQL Playground only works in dev environment
# ENV NODE_ENV="production"

COPY --from=base /usr/src .
CMD ["node", "./node_modules/.bin/micro"]