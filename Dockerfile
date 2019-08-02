FROM node:dubnium-alpine

COPY . .

RUN npm install && \
    npm run build && \
    cp package.* dist && \
    mv dist /app && \
    cd /app && \
    npm prune --production

WORKDIR /app

CMD [ "node", "main.js" ]
