FROM node:16

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

USER root

EXPOSE 80

CMD ["npm", "run", "dev", "--", "--port", "80", "--host"]
