# 1. Base Image
FROM node:22.13.1-alpine

# 2. Set the working directory
WORKDIR /app

# 3. Copy package.json and package-lock.json
COPY package.json .

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of the application code
COPY . .

# 6. Expose the port (not strictly required, but good practice)
EXPOSE 4000

# 7. Define the default command
CMD ["npm", "run", "dev"]
