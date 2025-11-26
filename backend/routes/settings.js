const express = require('express');
const router = express.Router();
const Settings = require('../models/settings');
const authMiddleware = require('../middleware/authMiddleware');

// Get settings
router.get('/', authMiddleware, async (req, res) => {
    try {
        let settings = await Settings.findOne({ user: req.user.id });
        if (!settings) {
            // Create default settings if not exists
            settings = new Settings({ user: req.user.id });
            await settings.save();
        }
        res.json(settings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update settings
router.put('/', authMiddleware, async (req, res) => {
    try {
        let settings = await Settings.findOne({ user: req.user.id });
        if (!settings) {
            settings = new Settings({ user: req.user.id });
        }
        
        // Update fields
        const fields = ['companyName', 'companyAddress', 'companyICE', 'logoDataUrl', 'vatEnabled', 'vatRate', 'currency', 'numberingPrefix', 'zeroPadding', 'resetNumberYearly', 'businessType', 'monthlyCap'];
        
        fields.forEach(field => {
            if (req.body[field] !== undefined) {
                settings[field] = req.body[field];
            }
        });

        await settings.save();
        res.json(settings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
