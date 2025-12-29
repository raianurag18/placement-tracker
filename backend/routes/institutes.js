const router = require('express').Router();
const Institute = require('../models/Institute');

// [Removed: Institute creation logic as per user request]

// Search institutes by name
router.get('/search', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.json([]);

        const institutes = await Institute.find({
            name: { $regex: new RegExp(q, 'i') } // Case-insensitive fuzzy search
        }).limit(10);

        res.json(institutes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
