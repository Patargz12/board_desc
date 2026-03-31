# -------- Build Stage --------
FROM node:20-alpine AS builder

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json/yarn.lock for dependency installation
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript code (output to /app/dist)
RUN npm run build

# -------- Production Stage --------
FROM node:20-alpine

# Set working directory for the production image
WORKDIR /app

# Create a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy only the necessary files from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env ./

# Install only production dependencies
RUN npm install --only=production

# Switch to the non-root user
USER appuser

# Expose the port your app runs on
EXPOSE 3000

# Healthcheck to ensure the container is running and serving traffic
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start the application
CMD ["node", "dist/index.js"]