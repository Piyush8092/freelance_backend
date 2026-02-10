FROM node:20-alpine

WORKDIR /app

# Copy ROOT package.json
COPY package*.json ./

RUN npm install --omit=dev

# Copy everything
COPY . .

# Go into backend folder (where index.js lives)
WORKDIR /app/backend

EXPOSE 3000

CMD ["node", "index.js"]
