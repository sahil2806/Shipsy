# Shipsy Backend

A Node.js backend API for the Shipsy shipping management system.

## Features

- 🚀 Express.js server with modern middleware
- 🗄️ MongoDB integration with Mongoose ODM
- 🔐 JWT authentication (ready for implementation)
- 🛡️ Security middleware (Helmet, CORS, Rate Limiting)
- 📝 API logging with Morgan
- 🏗️ Modular route structure
- 📊 User and Ship management APIs

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `env.example`:
```bash
cp env.example .env
```

3. Update the `.env` file with your MongoDB connection string:
```
MONGODB_URI=mongodb://localhost:27017/shipsy
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on port 5000 (or the port specified in your `.env` file).

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Ships
- `GET /api/ships` - Get all ships
- `POST /api/ships` - Create a new ship
- `GET /api/ships/:id` - Get ship by ID

## Database Models

### User Model
- Username, email, password
- Role-based access control
- Profile information
- Timestamps

### Ship Model
- Ship details and specifications
- Location tracking
- Maintenance history
- Crew information

## Project Structure

```
backend/
├── models/          # MongoDB schemas
├── routes/          # API route handlers
├── middleware/      # Custom middleware (to be added)
├── utils/           # Utility functions (to be added)
├── server.js        # Main server file
├── package.json     # Dependencies
└── README.md        # This file
```

## Next Steps

1. Implement password hashing with bcrypt
2. Add JWT token generation and validation
3. Create authentication middleware
4. Add input validation with Joi or express-validator
5. Implement error handling middleware
6. Add unit tests with Jest
7. Set up CI/CD pipeline

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

ISC 