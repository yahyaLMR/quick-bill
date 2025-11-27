const express = require('express');
const router = express.Router();
const Client = require('../models/client');

// @route   GET /api/clients
// @desc    Get all clients
// @access  Public (Consider making private)
router.get('/', async (req, res) => {
    try {
        const clients = await Client.find();
        res.json(clients);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   GET /api/clients/:id
// @desc    Get one client by ID
// @access  Public (Consider making private)
router.get('/:id', async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        if (!client) return res.status(404).json({ message: 'Client not found' });
        res.json(client);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   POST /api/clients
// @desc    Create a new client
// @access  Public (Consider making private)
router.post('/', async (req, res) => {
    const client = new Client({
        name: req.body.name,
        address: req.body.address,
        ice: req.body.ice
    });

    try {
        const newClient = await client.save();
        res.status(201).json(newClient);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// @route   PUT /api/clients/:id
// @desc    Update a client
// @access  Public (Consider making private)
router.put('/:id', async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        if (!client) return res.status(404).json({ message: 'Client not found' });

        if (req.body.name != null) client.name = req.body.name;
        if (req.body.address != null) client.address = req.body.address;
        if (req.body.ice != null) client.ice = req.body.ice;

        const updatedClient = await client.save();
        res.json(updatedClient);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// @route   DELETE /api/clients/:id
// @desc    Delete a client
// @access  Public (Consider making private)
router.delete('/:id', async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        if (!client) return res.status(404).json({ message: 'Client not found' });
        
        await client.deleteOne();
        res.json({ message: 'Client deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
