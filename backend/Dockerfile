FROM node:22

WORKDIR /app

# Instala sqlite3 CLI
RUN apt-get update && apt-get install -y sqlite3

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "start"]
