FROM node:18-bullseye-slim as build

WORKDIR /app
COPY . .

WORKDIR /app/client
RUN npm install
RUN npm run build

WORKDIR /app/server
RUN npm install
RUN npm run tsc

WORKDIR /app/server

CMD ["npm", "run", "start"]