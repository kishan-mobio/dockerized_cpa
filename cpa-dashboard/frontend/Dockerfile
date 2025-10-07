# Use Node.js LTS
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install Python and other build dependencies for canvas
RUN apk add --no-cache python3 make g++ pkgconfig pixman-dev cairo-dev pango-dev jpeg-dev giflib-dev

# Copy package files and install dependencies with memory optimization
COPY package.json yarn.lock* package-lock.json* ./
RUN npm install --no-audit --no-fund --prefer-offline --max-old-space-size=2048

# Copy only necessary project files
COPY public ./public
COPY src ./src
COPY *.json *.js *.mjs ./

# Expose Next.js port
EXPOSE 3000

# Default command to run app in dev mode
CMD ["npm", "run", "dev"]
