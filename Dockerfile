# Use stable Node LTS
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy dependency files first (better caching)
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy rest of backend code
COPY . .

# App runs on this port
EXPOSE 3000

# Start your existing index.js
CMD ["node", "index.js"]
