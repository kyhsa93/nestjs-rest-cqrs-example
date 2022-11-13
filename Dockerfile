FROM node:hydrogen-alpine AS builder
COPY . /app
WORKDIR /app
RUN npm ci && npm run build

FROM node:hydrogen-alpine
COPY --from=builder /app/dist /app
COPY package*.json /app/
WORKDIR /app
RUN npm ci --omit=dev
EXPOSE 5000
ENTRYPOINT ["node", "src/main.js"]
