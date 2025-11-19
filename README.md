# Student Achievement Tracking & Showcase Portal

A comprehensive web application built with the MERN stack that allows students to record and track their achievements, which are then verified by faculty/admin for institutional record-keeping and recognition.

## Features

### Student Module
- Submit achievements with details (title, date, level, proof, category)
- Upload supporting documents or certificates
- View approval status and personal achievement timeline

### Faculty/Admin Module
- Verify student achievements and mark as approved
- Generate department-wise and category-wise achievement analytics
- Export verified reports for institutional use

### Public View (Optional)
- Showcase top achievements on college website

## Tech Stack

- **Frontend**: React.js with Redux for state management
- **Backend**: Node.js + Express.js REST API
- **Database**: MongoDB with Mongoose
- **File Uploads**: Firebase Storage (planned)
- **Authentication**: JWT
- **Charts**: Recharts for analytics visualization

## Project Structure

```
student-achievement-portal/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── services/
│   │   ├── utils/
│   │   └── App.js
│   └── public/
├── .env
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Install backend dependencies:
   ```bash
   cd student-achievement-portal
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

4. Create a `.env` file in the root directory with the following variables:
   ```
   NODE_ENV=development
   PORT=5000
   # For local MongoDB:
   MONGODB_URI=mongodb://localhost:27017/student-achievements
   # For MongoDB Atlas (replace with your actual connection string):
   # MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
   JWT_SECRET=your_jwt_secret_key
   ```

5. Create a `.env` file in the frontend directory:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

### MongoDB Atlas Configuration

To use MongoDB Atlas instead of local MongoDB:

1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Create a database user with read/write permissions
4. Add your IP address to the IP whitelist (or allow access from anywhere for development)
5. Get your connection string from the "Connect" button
6. Update your `.env` file with the Atlas connection string:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
   ```

### Running the Application

1. Start the backend server:
   ```bash
   # From the root directory
   npm run server
   ```

2. Start the frontend development server:
   ```bash
   # From the frontend directory
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

### Testing MongoDB Connection

To test if your MongoDB connection is working properly:
```bash
npm run test:mongo
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Achievements
- `POST /api/achievements` - Create new achievement
- `GET /api/achievements/my` - Get all achievements for logged-in student
- `GET /api/achievements` - Get all achievements (faculty/admin)
- `PUT /api/achievements/:id/status` - Update achievement status
- `GET /api/achievements/stats` - Get achievement statistics

### Users
- `GET /api/users` - Get all users (admin)
- `GET /api/users/:id` - Get user by ID (admin)
- `PUT /api/users/:id` - Update user (admin)

## Troubleshooting

### MongoDB Connection Issues

1. **Check your connection string**: Ensure your MONGODB_URI in `.env` is correct
2. **IP Whitelisting**: Make sure your IP is whitelisted in MongoDB Atlas
3. **Network connectivity**: Ensure you can connect to MongoDB Atlas from your network
4. **Credentials**: Verify your username and password are correct

### Data Not Appearing in Database

1. **Check server logs**: Look for any error messages in the backend console
2. **Verify MongoDB connection**: Ensure the server is successfully connected to MongoDB
3. **Check API endpoints**: Use browser dev tools to verify API requests are successful

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with the MERN stack
- Uses Recharts for data visualization
- Implements JWT for secure authentication