FROM node:10

WORKDIR /app

COPY package*.json ./

# Install dependencies
RUN npm ci

COPY . .

# Build/bundle the app
RUN npm run build-prod

EXPOSE 8080
CMD ["node", "./dist/server.js"]
