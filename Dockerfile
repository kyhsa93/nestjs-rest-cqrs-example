FROM node:erbium-alpine

COPY . /origin

WORKDIR /origin

RUN npm install && \
    npm test && \
    npm run build && \
    npm prune --production && \
    cp -r dist /app && \
    cp -r node_modules /app/node_modules && \
    rm -rf /origin

WORKDIR /app

EXPOSE 5000

CMD ["node", "main.js"]
