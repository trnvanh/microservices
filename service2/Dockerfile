FROM node:18
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
VOLUME ["/mnt/vstorage"]
EXPOSE 3000
CMD ["node", "server.js"]
