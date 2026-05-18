const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const User = require('./models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Middleware
app.use(cors());
app.use(express.json());
// Database connection
const connectDB = require('./config/dbconnect');
// Connect to MongoDB
connectDB();

// Serve static files
app.use('/uploads', express.static('uploads'));

// Routes
const invoiceRoutes = require('./routes/invoices');
const clientRoutes = require('./routes/clients');
const userRoutes = require('./routes/auth');
const settingsRoutes = require('./routes/settings');
const verificationRoutes = require('./routes/verification');
const uploadRoutes = require('./routes/upload');

// Use Routes
app.use('/api/users', userRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/auth', verificationRoutes);
app.use('/api/upload', uploadRoutes);

app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'invalid email' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(400).json({ message: 'invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '20m',
    });

    res.status(200).json({
      message: 'Login successful',
      token,
      email: user.email,
      name: user.name,
      phone: user.phone,
      avatar: user.avatar,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});