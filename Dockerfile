FROM node:12
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run buildProd
EXPOSE 8080
CMD ["npm", "start"]
