const express = require('express');
const router = express.Router();
const Invoice = require('../models/invoice');

// Create a new invoice
router.post('/', async (req, res) => {
    try {
        const invoiceData = req.body;
        const newInvoice = new Invoice(invoiceData);
        const savedInvoice = await newInvoice.save();
        res.status(201).json(savedInvoice);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;