const express = require('express');
const router = express.Router();
const Settings = require('../models/settings');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// @route   GET /api/settings
// @desc    Get user settings
// @access  Private
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

// @route   PUT /api/settings
// @desc    Update user settings
// @access  Private
router.put('/', authMiddleware, upload.single('logo'), async (req, res) => {
    try {
        let settings = await Settings.findOne({ user: req.user.id });
        if (!settings) {
            settings = new Settings({ user: req.user.id });
        }
        
        // Update fields
        const fields = ['companyName', 'companyAddress', 'companyICE', 'vatEnabled', 'vatRate', 'currency', 'numberingPrefix', 'zeroPadding', 'resetNumberYearly', 'businessType', 'monthlyCap'];
        
        fields.forEach(field => {
            if (req.body[field] !== undefined) {
                settings[field] = req.body[field];
            }
        });

        // Handle Logo
        if (req.file) {
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            settings.logoDataUrl = `${baseUrl}/uploads/${req.file.filename}`;
        } else if (req.body.logoDataUrl === '') {
            settings.logoDataUrl = '';
        }

        await settings.save();
        res.json(settings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
