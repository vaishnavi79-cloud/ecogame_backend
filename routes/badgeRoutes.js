const express = require('express');
const router = express.Router();
const Badge = require('../models/Badge');
const auth = require('../middleware/auth');

// Get all badges
router.get('/', async (req, res) => {
    const badges = await Badge.find();
    res.json(badges);
});

// Create badge
router.post('/', auth, async (req, res) => {
    try {
        const badge = new Badge(req.body);
        await badge.save();

        res.json({ success: true, badge });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;