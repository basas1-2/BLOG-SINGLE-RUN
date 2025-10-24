require('dotenv').config();
const cors = require ("cors")
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blogs');

const app = express();

app.use(cors({
  origin: "https://blog-single-run.vercel.app/"
}));

// Connect DB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve frontend static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);

// Fallback route to serve index.html for SPA-like navigation
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
