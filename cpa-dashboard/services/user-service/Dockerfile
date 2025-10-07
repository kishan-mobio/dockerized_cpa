# FROM node:20-alpine

# WORKDIR /app

# # Copy package.json and package-lock.json first
# COPY package.json package-lock.json* ./

# # Copy shared packages (inside build context)
# COPY ../../packages/shared ./packages/shared

# # Copy service code
# COPY app ./app
# COPY config ./config
# COPY migrations ./migrations

# # Install dependencies inside container
# RUN npm install --legacy-peer-deps

# # Expose port
# EXPOSE 3001

# # Start service
# CMD ["npm", "run", "dev"]
# # --------------------------------------------------------Working Dockerfile above--------------------------------------------------------
# FROM node:20-alpine

# WORKDIR /app

# # Copy package.json and package-lock.json first
# COPY package.json package-lock.json* ./

# # Copy shared package

# # Copy service code
# COPY app ./app
# COPY config ./config
# COPY migrations ./migrations

# # Install dependencies
# RUN npm install --legacy-peer-deps

# # Install nodemon globally for hot reload
# RUN npm install -g nodemon

# # Expose port
# EXPOSE 3001

# # Start service
# CMD ["npm", "run", "dev"]

FROM node:20-alpine

WORKDIR /app

# Copy only package.json first for caching
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Install nodemon globally
RUN npm install -g nodemon

# Copy the rest of the source (won’t matter much because of volume mount)
COPY app ./app
COPY config ./config
COPY migrations ./migrations
COPY index.js ./

# Expose port
EXPOSE 3003

# Use nodemon with polling for reliable Docker hot reload
CMD ["nodemon", "--legacy-watch", "--watch", "app", "--watch", "config", "--watch", "index.js", "index.js"]
