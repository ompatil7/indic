const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3000;

// Enable CORS to allow React frontend to communicate with this backend
app.use(cors({ origin: 'http://localhost:3001', credentials: true }));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB!');
});

// User Schema
const userSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number, required: true },
    nativeLanguage: { 
        type: String, 
        enum: ['Hindi', 'English', 'Marathi', 'Other'],
        required: true 
    },
    learningLanguage: { 
        type: String, 
        enum: ['Hindi', 'English', 'Marathi', 'Other'],
        required: true 
    },
    speciallyAbled: { 
        type: Boolean, 
        default: false,
        required: true 
    }
});

const User = mongoose.model('User', userSchema);

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set up session with MongoStore
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: { secure: false },
}));

// Signup route
app.post("/signup", async (req, res) => {
    try {
        const { 
            fullname, 
            username, 
            email, 
            password, 
            age, 
            nativeLanguage, 
            learningLanguage, 
            speciallyAbled 
        } = req.body;

        // Validate password length
        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long." });
        }

        // Check for existing user or email
        const existingUser = await User.findOne({ username });
        const existingEmail = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "Username already exists. Please choose a different one." });
        }
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists. Please choose a different one." });
        }

        // Hash password and create user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ 
            fullname, 
            username, 
            email, 
            password: hashedPassword,
            age,
            nativeLanguage,
            learningLanguage,
            speciallyAbled
        });

        await newUser.save();
        res.status(201).json({ message: "User created successfully. Please login to continue." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
});

// Login route
app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Invalid password." });
        }

        req.session.userId = user._id.toString();
        req.session.username = user.username;

        res.status(200).json({
            message: "Login successful.",
            user: { username: user.username }
        });
    } catch (error) {
        console.error('Detailed Error:', error);
        res.status(500).json({ 
            message: "Error creating user", 
            errorDetails: error.message,
            stack: error.stack 
        });
    }
    
});

// Logout route
app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: "Could not log out. Please try again." });
        }
        res.status(200).json({ message: "Logged out successfully." });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});