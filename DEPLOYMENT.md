# Deployment Guide

This guide explains how to deploy the Student Achievement Portal to different hosting platforms.

## Prerequisites

1. Node.js (v14 or higher)
2. MongoDB database (local or cloud instance)
3. Firebase account for file storage (optional)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

## Deployment Options

### 1. Heroku Deployment

1. Create a Heroku account and install the Heroku CLI
2. Create a new Heroku app:
   ```bash
   heroku create your-app-name
   ```

3. Set environment variables:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your_mongodb_connection_string
   heroku config:set JWT_SECRET=your_jwt_secret_key
   ```

4. Deploy the app:
   ```bash
   git push heroku main
   ```

### 2. AWS Deployment

1. Create an EC2 instance or use AWS Elastic Beanstalk
2. Install Node.js and MongoDB on the server
3. Clone the repository to the server
4. Install dependencies:
   ```bash
   npm install
   cd frontend && npm install
   ```

5. Build the frontend:
   ```bash
   npm run build
   ```

6. Set environment variables and start the server:
   ```bash
   npm start
   ```

### 3. Docker Deployment

1. Build the Docker image:
   ```bash
   docker build -t student-achievement-portal .
   ```

2. Run the container:
   ```bash
   docker run -p 5000:5000 -e MONGODB_URI=your_mongodb_connection_string student-achievement-portal
   ```

### 4. DigitalOcean Deployment

1. Create a DigitalOcean droplet
2. SSH into the droplet
3. Install Node.js, MongoDB, and Git
4. Clone the repository
5. Install dependencies and build the frontend
6. Set environment variables
7. Use PM2 to run the application:
   ```bash
   npm install -g pm2
   pm2 start backend/server.js
   ```

## File Storage Configuration

For production, configure Firebase Storage or AWS S3 for file uploads:

1. Create a Firebase project or AWS S3 bucket
2. Obtain the necessary credentials
3. Update the environment variables with your storage configuration

## Database Configuration

For production, use a cloud MongoDB service like MongoDB Atlas:

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Configure network access and database user
4. Obtain the connection string
5. Set the MONGODB_URI environment variable

## Monitoring and Logging

Consider implementing:

1. Application performance monitoring (e.g., New Relic)
2. Error tracking (e.g., Sentry)
3. Log aggregation (e.g., Loggly, Papertrail)
4. Health checks and uptime monitoring

## Scaling

For high-traffic scenarios:

1. Use a load balancer
2. Implement database indexing
3. Use Redis for caching
4. Implement database connection pooling
5. Consider microservices architecture for large-scale deployments