const express = require('express');
const router = express.Router();
const Invoice = require('../models/invoice');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

// @route   GET /api/invoices
// @desc    Get all invoices for the logged-in user
// @access  Private
router.get('/', async (req, res) => {
    try {
        const invoices = await Invoice.find({ userId: req.user.id });
        res.json(invoices);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   GET /api/invoices/:id
// @desc    Get one invoice by ID
// @access  Private
router.get('/:id', async (req, res) => {
    try {
        const invoice = await Invoice.findOne({ _id: req.params.id, userId: req.user.id });
        if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
        res.json(invoice);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   POST /api/invoices
// @desc    Create a new invoice
// @access  Private
router.post('/', async (req, res) => {
    try {
        const invoiceData = { ...req.body, userId: req.user.id };
        const newInvoice = new Invoice(invoiceData);
        const savedInvoice = await newInvoice.save();
        res.status(201).json(savedInvoice);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @route   PUT /api/invoices/:id
// @desc    Update an invoice
// @access  Private
router.put('/:id', async (req, res) => {
    try {
        const invoice = await Invoice.findOne({ _id: req.params.id, userId: req.user.id });
        if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
        
        Object.assign(invoice, req.body);
        const updatedInvoice = await invoice.save();
        res.json(updatedInvoice);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// @route   DELETE /api/invoices/:id
// @desc    Delete an invoice
// @access  Private
router.delete('/:id', async (req, res) => {
    try {
        const invoice = await Invoice.findOne({ _id: req.params.id, userId: req.user.id });
        if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
        
        await invoice.deleteOne();
        res.json({ message: 'Invoice deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;