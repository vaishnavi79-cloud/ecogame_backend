const express = require("express");
const router = express.Router();

const User = require("../models/User");
const auth = require("../middleware/auth");


/* ==================================
   GET USER PROFILE
================================== */
router.get("/profile", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select("-password")
            .populate("badgesEarned");

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


/* ==================================
   LEADERBOARD
================================== */
router.get("/leaderboard", async (req, res) => {
    try {
        const users = await User.find()
            .sort({ ecoPoints: -1 })
            .select("name ecoPoints badgesEarned school");

        res.json({
            success: true,
            leaderboard: users
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


/* ==================================
   GET USER BY ID (Teacher View)
================================== */
router.get("/:id", auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select("-password")
            .populate("badgesEarned activitiesCompleted");

        if (!user)
            return res.status(404).json({ error: "User not found" });

        res.json(user);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;