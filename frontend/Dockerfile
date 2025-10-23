# Use Node.js base image
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /frontend

# Copy package definitions and install dependencies
COPY package*.json ./
RUN npm ci

# Copy everything else into the image (for production build)
COPY . .

# Expose the port where Vite runs
EXPOSE 5173

# Run Vite dev server, accessible from outside the container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
