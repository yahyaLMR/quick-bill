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
const invoiceRoutes = require('./routes/invoices');
const clientRoutes = require('./routes/clients');
const userRoutes = require('./routes/auth');

app.use('/api/users', userRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/clients', clientRoutes);


app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});