# Use same base image for consistency
FROM node:20-slim

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy frontend source
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Run Vite dev server
CMD ["npm", "run", "dev"]
