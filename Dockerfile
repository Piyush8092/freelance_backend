FROM node:20-alpine

WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy backend source code
COPY backend .

EXPOSE 3000

CMD ["npm", "start"]
