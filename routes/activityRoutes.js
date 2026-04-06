const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Activity = require("../models/Activity");
const User = require("../models/User");
const UserActivity = require("../models/UserActivity");

const auth = require("../middleware/auth");

// ================= GET ALL ACTIVITIES =================
router.get("/", async (req, res) => {
    try {
        const activities = await Activity.find();
        res.json(activities);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ================= CREATE ACTIVITY =================
router.post("/", async (req, res) => {
    try {
        const activity = new Activity(req.body);
        await activity.save();

        res.json({
            success: true,
            activity
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ================= COMPLETE ACTIVITY =================
router.post("/complete", auth, async (req, res) => {
    try {
        const { activityId } = req.body;
        const userId = req.user.id;

        // ✅ Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(activityId)) {
            return res.status(400).json({ error: "Invalid Activity ID" });
        }

        const activity = await Activity.findById(activityId);
        if (!activity)
            return res.status(404).json({ error: "Activity not found" });

        // Prevent duplicate completion
        const alreadyDone = await UserActivity.findOne({
            userId,
            activityId
        });

        if (alreadyDone)
            return res.status(400).json({
                error: "Activity already completed"
            });

        // Save completion
        const completion = new UserActivity({
            userId,
            activityId,
            pointsEarned: activity.pointsReward
        });

        await completion.save();

        // Add eco points to user
        const user = await User.findById(userId);
        user.ecoPoints += activity.pointsReward;
        await user.save();

        res.json({
            success: true,
            message: "Activity completed 🎉",
            pointsEarned: activity.pointsReward,
            totalPoints: user.ecoPoints
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;