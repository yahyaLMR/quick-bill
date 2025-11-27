const express = require('express');
const router = express.Router();
const Invoice = require('../models/invoice');

// Get all invoices
router.get('/', async (req, res) => {
    try {
        const invoices = await Invoice.find();
        res.json(invoices);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get one invoice
router.get('/:id', async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
        res.json(invoice);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

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

// Update an invoice
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

// Delete an invoice
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