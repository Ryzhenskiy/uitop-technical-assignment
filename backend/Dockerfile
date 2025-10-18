# Use Debian-based Node image for compatibility with native modules
FROM node:20-slim

WORKDIR /usr/src/app

# Install build tools required for native Node modules
RUN apt-get update && \
    apt-get install -y python3 make g++ bash && \
    rm -rf /var/lib/apt/lists/*

# Copy only package files first (to use Docker caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the backend source code
COPY . .

# Rebuild native modules like better-sqlite3 for this environment
RUN npm rebuild better-sqlite3

# for seed man
RUN npm run seed
# Expose NestJS dev port
EXPOSE 3000
# Run NestJS in development mode (watch mode)
CMD ["npm", "run", "start:dev"]
