require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session'); // Add this line

const dbConnect = require('./config/db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const projectRoutes = require('./routes/project');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Use express-session before passport.initialize()
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key', // Make sure to set a session secret in .env
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' } // Set secure cookies for production
}));

app.use(passport.initialize());
app.use(passport.session()); // Use passport.session() to handle login sessions

// Load Passport strategies
require('./config/passport')(passport);

// Connect to database
dbConnect();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/projects', projectRoutes);

// Default route
app.get('/', (req, res) => {
    res.send('Welcome to the Open Source Connect API!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
