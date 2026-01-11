# Backend Dockerfile - SIKP Warmindo Point8
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Copy prisma schema BEFORE npm install (needed for postinstall)
COPY prisma ./prisma/

# Install dependencies (this will run postinstall -> prisma generate)
RUN npm install

# Copy the rest of the application
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
