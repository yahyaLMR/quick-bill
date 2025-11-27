const express = require('express');
const router = express.Router();
const Invoice = require('../models/invoice');

// @route   GET /api/invoices
// @desc    Get all invoices
// @access  Public (Consider making private)
router.get('/', async (req, res) => {
    try {
        const invoices = await Invoice.find();
        res.json(invoices);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   GET /api/invoices/:id
// @desc    Get one invoice by ID
// @access  Public (Consider making private)
router.get('/:id', async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
        res.json(invoice);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   POST /api/invoices
// @desc    Create a new invoice
// @access  Public (Consider making private)
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

// @route   PUT /api/invoices/:id
// @desc    Update an invoice
// @access  Public (Consider making private)
router.put('/:id', async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
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
// @access  Public (Consider making private)
router.delete('/:id', async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
        
        await invoice.deleteOne();
        res.json({ message: 'Invoice deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;