const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    const { name, email, password, phone, avatar } = req.body; // Add other fields as necessary
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        let hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, phone, avatar });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    try {
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        let token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1m' });
        res.status(200).json({ message: 'Login successful', token, email: user.email, name: user.name, phone: user.phone, avatar: user.avatar });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;