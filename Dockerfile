FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm i --only=production

COPY . .

RUN mkdir -p images

EXPOSE 3000

CMD ["node", "app.js"]