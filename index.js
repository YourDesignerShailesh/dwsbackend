require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const cors = require('cors'); // added dependency for enabling CORS
const mongoose = require('mongoose'); // added dependency for MongoDB
const Portfolio = require('./models/portfolio'); // Changed variable from "Info" to "Portfolio"
const Contact = require('./models/Contact'); // Added Contact model import
const app = express();
const PORT = process.env.PORT || 4000; // Fixed PORT assignment

app.use(cors()); // enable CORS for all routes
app.use(express.json()); // added middleware for JSON parsing

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI ; // Fallback to local MongoDB

// Enable Mongoose debugging
mongoose.set('debug', true);

// MongoDB connection with enhanced error handling
mongoose.connect(MONGODB_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    serverSelectionTimeoutMS: 30000 // added timeout option to avoid ETIMEOUT errors
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Could not connect to MongoDB:', err.message);
    process.exit(1); // Exit the process if the connection fails
  });

// Log connection errors after initial connection
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err.message);
});

// Basic route
app.get('/', (req, res) => {
  res.send('Server is running...');
});

// GET API to retrieve portfolio (image and title) from the database
app.get('/api/portfolio', async (req, res) => {
  try {
    const portfolio = await Portfolio.find();
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
});

// POST API to add portfolio (image and title) to the database
app.post('/api/portfolio', async (req, res) => {
  try {
    const { title, image, link } = req.body; // added link field
    const newPortfolio = new Portfolio({ title, image, link }); // include link field
    await newPortfolio.save();
    res.status(201).json(newPortfolio);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add portfolio' });
  }
});

// PUT API to update portfolio by id
app.put('/api/portfolio/:id', async (req, res) => {
  try {
    const { title, image, link } = req.body; // added link field
    const updatedPortfolio = await Portfolio.findByIdAndUpdate(
      req.params.id, 
      { title, image, link }, // include link field
      { new: true, runValidators: true }
    );
    if (!updatedPortfolio) return res.status(404).json({ error: 'Portfolio not found' });
    res.json(updatedPortfolio);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update portfolio' });
  }
});

// DELETE API to delete portfolio by id
app.delete('/api/portfolio/:id', async (req, res) => {
  try {
    const deletedPortfolio = await Portfolio.findByIdAndDelete(req.params.id);
    if (!deletedPortfolio) return res.status(404).json({ error: 'Portfolio not found' });
    res.json({ message: 'Portfolio deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete portfolio' });
  }
});

// GET API to retrieve contact data from the database
app.get('/api/contact', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

// POST API to add contact data to the database
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, mobile_no, subject, message } = req.body;
    const newContact = new Contact({ name, email, mobile_no, subject, message });
    await newContact.save();
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add contact' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
