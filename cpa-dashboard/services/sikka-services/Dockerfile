FROM node:20-alpine

WORKDIR /app

# Copy only package.json first for caching
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Install nodemon globally for hot reload
RUN npm install -g nodemon

# Copy the rest of the source
COPY app ./app
COPY config ./config
COPY migrations ./migrations
COPY index.js ./

# Expose port (sikka-services default assumption: 3004)
EXPOSE 3004

# Use nodemon with polling for reliable Docker hot reload
CMD ["nodemon", "--legacy-watch", "--watch", "app", "--watch", "config", "--watch", "index.js", "index.js"]
