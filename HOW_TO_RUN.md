# How to Run the Student Achievement Portal

This guide explains how to set up and run the Student Achievement Portal on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm (comes with Node.js)
- MongoDB (local installation or cloud instance)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd student-achievement-portal
```

### 2. Backend Setup

Navigate to the root directory and install backend dependencies:

```bash
npm install
```

### 3. Frontend Setup

Navigate to the frontend directory and install dependencies:

```bash
cd frontend
npm install
cd ..
```

### 4. Environment Configuration

Create a `.env` file in the root directory with the following content:

```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/student_achievement_portal
JWT_SECRET=student_achievement_portal_secret_key
```

Create a `.env` file in the frontend directory:

```
REACT_APP_API_URL=http://localhost:5000/api
```

### 5. MongoDB Setup

Make sure MongoDB is running on your system. If you don't have MongoDB installed:

1. Download and install MongoDB from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start the MongoDB service:
   - On Windows: `net start MongoDB`
   - On macOS/Linux: `sudo systemctl start mongod`

### 6. Running the Application

#### Option 1: Run Backend and Frontend Separately

1. Start the backend server:
   ```bash
   npm run server
   ```

2. In a new terminal, start the frontend development server:
   ```bash
   cd frontend
   npm start
   ```

#### Option 2: Run Both Services Concurrently

From the root directory:
```bash
npm run dev
```

This will start both the backend server on port 5000 and the frontend development server on port 3000.

### 7. Access the Application

Open your browser and navigate to:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Development Scripts

- `npm run server`: Start backend server with nodemon for auto-restart
- `npm run client`: Start frontend development server
- `npm run dev`: Run both frontend and backend concurrently
- `npm start`: Start production server
- `npm test`: Run tests (if configured)

## Building for Production

To create a production build:

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   cd ..
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## Docker Setup (Alternative)

If you prefer to run the application using Docker:

1. Make sure Docker is installed on your system
2. Run the application using docker-compose:
   ```bash
   docker-compose up
   ```

This will start three containers:
- MongoDB database
- Backend Node.js server
- Frontend development server

## Troubleshooting

### Common Issues

1. **Port already in use**: If port 3000 or 5000 is already in use, you can change the ports in the respective configuration files.

2. **MongoDB connection error**: Ensure MongoDB is running and the connection string in `.env` is correct.

3. **Dependency installation issues**: Try deleting `node_modules` folders and `package-lock.json` files, then reinstall dependencies.

4. **CORS errors**: The application should already have CORS configured, but if you encounter issues, check the backend middleware configuration.

### Need Help?

If you encounter any issues not covered here:
1. Check the console logs for error messages
2. Verify all environment variables are set correctly
3. Ensure all dependencies are properly installed
4. Check that MongoDB is running and accessible

For additional support, refer to the documentation in the repository or contact the development team.