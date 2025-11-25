const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
// Middleware
app.use(cors());
app.use(express.json());
// Database connection
const connectDB = require('./config/dbconnect');
connectDB();

// Routes
// const settingsRoutes = require('./routes/settingsRoutes');
// const invoiceRoutes = require('./routes/invoiceRoutes');
// const userRoutes = require('./routes/userRoutes');

// app.use('/api/settings', settingsRoutes);
// app.use('/api/invoices', invoiceRoutes);
// app.use('/api/users', userRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});