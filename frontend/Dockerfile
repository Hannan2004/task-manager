# Use Node.js image for building the React app
FROM node:18 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first for caching dependencies
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the React app
RUN npm run build

# Use Nginx to serve the built React app
FROM nginx:alpine

# Copy the built files from the build stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 to serve the frontend
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
