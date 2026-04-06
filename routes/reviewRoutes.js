const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const teacherAuth = require("../middleware/teacherAuth");
const UserActivity = require("../models/UserActivity");
const User = require("../models/User");

// GET all pending submissions
router.get("/pending", auth, teacherAuth, async (req, res) => {
    try {
        const activities = await UserActivity.find({ status: "pending" })
            .populate("userId", "name email school")
            .populate("activityId")
            .sort({ completedAt: -1 });

        res.json({ success: true, submissions: activities });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET all submissions (all statuses)
router.get("/all", auth, teacherAuth, async (req, res) => {
    try {
        const activities = await UserActivity.find()
            .populate("userId", "name email school")
            .populate("activityId")
            .sort({ completedAt: -1 });

        res.json({ success: true, submissions: activities });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// APPROVE submission + add points + save feedback
router.post("/approve/:id", auth, teacherAuth, async (req, res) => {
    try {
        const { feedback } = req.body;

        const submission = await UserActivity.findById(req.params.id)
            .populate("activityId");

        if (!submission)
            return res.status(404).json({ error: "Submission not found" });

        if (submission.status === "approved")
            return res.status(400).json({ error: "Already approved" });

        // Update submission
        submission.status = "approved";
        submission.feedback = feedback || "Great work!";
        await submission.save();

        // Add points to student
        const points = submission.activityId?.points || 10;
        await User.findByIdAndUpdate(submission.userId, {
            $inc: { ecoPoints: points }
        });

        res.json({ success: true, message: "Submission approved and points added" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// REJECT submission + save feedback
router.post("/reject/:id", auth, teacherAuth, async (req, res) => {
    try {
        const { feedback } = req.body;

        const submission = await UserActivity.findById(req.params.id);

        if (!submission)
            return res.status(404).json({ error: "Submission not found" });

        submission.status = "rejected";
        submission.feedback = feedback || "Please try again.";
        await submission.save();

        res.json({ success: true, message: "Submission rejected" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET submissions for a specific student
router.get("/user/:userId", auth, async (req, res) => {
    try {
        const activities = await UserActivity.find({ userId: req.params.userId })
            .populate("activityId")
            .sort({ completedAt: -1 });

        res.json({ success: true, submissions: activities });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;