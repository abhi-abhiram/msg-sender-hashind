##### DEPENDENCIES
# Use the official Node.js runtime as a parent image
FROM node:18-alpine3.17

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the application for production
RUN SKIP_ENV_VALIDATION=1 npm run build

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "start"]