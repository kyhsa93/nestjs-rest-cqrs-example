FROM node:dubnium-alpine

COPY . /origin

WORKDIR /origin

RUN npm install && \
    npm run test && \
    npm run build && \
    npm prune --production && \
    cp -r dist /app && \
    cp -r node_modules /app/node_modules && \
    rm -rf /origin

WORKDIR /app

CMD ["node", "main.js"]

