const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

// Creating an express application instance
const app = express();
const PORT = 5000;

// Enable cors
app.use(
	cors({
		origin: 'http://localhost:3000',
		allowedHeaders: ['Authorization', 'Content-Type'],
	})
);

// Connect to MongoDB
mongoose
	.connect(process.env.MONGODB_URI)
	.then(() => {
		console.log('Connected to MongoDB');
	})
	.catch((error) => {
		console.error('Error connecting to MongoDB:', error);
	});

// Define a schema for the User collection
const userSchema = new mongoose.Schema({
	username: String,
	email: String,
	password: String,
	occupation: String,
	profileUrl: String,
});

// Create a user model based on schema
const User = mongoose.model('User', userSchema);

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware for JWT validation
const verifyToken = (req, res, next) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1]; // Extract token part
	if (!token) {
		return res.status(401).json({ error: 'Unauthorized' });
	}

	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if (err) {
			return res.status(401).json({ error: 'Unauthorized' });
		}
		req.user = decoded;
		next();
	});
};

// Route to register a new user
app.post('/api/register', async (req, res) => {
	console.log('Request Body:', req.body);

	try {
		// Check if the email already exists
		const existingUser = await User.findOne({ email: req.body.email });
		if (existingUser) {
			return res.status(400).json({ error: 'Email already exists' });
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(req.body.password, 10);

		// Create a new user
		const newUser = new User({
			username: req.body.username,
			email: req.body.email,
			password: hashedPassword,
			occupation: req.body.occupation,
		});

		await newUser.save();
		res.status(201).json({ message: 'User registered successfully' });
	} catch (error) {
		res.status(500).json({ error: 'Internal server error' });
	}
});

// Route to authenticate and log in a user
app.post('/api/login', async (req, res) => {
	try {
		console.log('Request Body:', req.body);

		const { email, password } = req.body;

		// Check if the email exists
		const user = await User.findOne({ email: email });
		if (!user) {
			return res.status(401).json({ error: 'Invalid credentials' });
		}

		// Verify password
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(401).json({ error: 'Invalid credentials' });
		}

		// Generate JWT token
		const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
			expiresIn: '1h',
		});
		res.status(200).json({ token });
	} catch (error) {
		console.error('Login Error:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// Protected route to get user details
app.get('/api/user', verifyToken, async (req, res) => {
	try {
		// Fetch user details using decoded token
		const user = await User.findOne({ email: req.user.email });
		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}
		res.status(200).json({
			username: user.username,
			email: user.email,
			occupation: user.occupation,
		});
	} catch (error) {
		res.status(500).json({ error: 'Internal server error' });
	}
});

// Route to update user occupation
app.patch('/api/user/occupation', verifyToken, async (req, res) => {
	try {
		console.log('Request Body:', req.body);
		const { occupation } = req.body;
		if (!req.user || !occupation) {
			return res.status(400).json({ error: 'Invalid data' });
		}

		// Update user based on email
		const updatedUser = await User.findOneAndUpdate(
			{ email: req.user.email }, // Search criteria
			{ $set: { occupation: occupation } }, // Update operation
			{ new: true } // Return updated document
		);

		if (!updatedUser) {
			return res.status(404).json({ error: 'User not found' });
		}

		res.status(200).json(updatedUser);
	} catch (error) {
		res.status(500).json({ error: 'Internal server error' });
	}
});

// Route to delete occupation
app.delete('/api/user/occupation', verifyToken, async (req, res) => {
	try {
		const user = await User.findOneAndUpdate(
			{ email: req.user.email },
			{ $unset: { occupation: '' } },
			{ new: true }
		);

		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		res.status(200).json({ message: 'Occupation deleted successfully', user });
	} catch (error) {
		console.error('Error deleting occupation:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// Default route
app.get('/', (req, res) => {
	res.send('Welcome to my User Registration and Login API!');
});

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
