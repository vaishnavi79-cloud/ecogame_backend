const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const teacherAuth = require("../middleware/teacherAuth");
const UserActivity = require("../models/UserActivity");
const User = require("../models/User");

// MULTER SETUP
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });


// =======================
// SUBMIT ACTIVITY (STUDENT)
// =======================
router.post("/submit", auth, upload.single("proofImage"), async (req, res) => {
    try {
        const { userId, moduleNumber } = req.body;

        const Activity = require("../models/Activity");

        const activity = await Activity.findOne({
            moduleNumber: parseInt(moduleNumber)
        });

        if (!activity) {
            return res.status(404).json({ error: "Activity not found for this module" });
        }

        const existing = await UserActivity.findOne({
            userId,
            moduleNumber: parseInt(moduleNumber),
            status: { $in: ["pending", "approved"] }
        });

        if (existing) {
            return res.status(400).json({ error: "You have already submitted this module" });
        }

        let proofImage = "";
        if (req.file) {
            proofImage = `http://10.18.129.200:5000/uploads/${req.file.filename}`;;
        }

        const submission = new UserActivity({
            userId,
            activityId: activity._id,
            moduleNumber: parseInt(moduleNumber),
            proofImage,
            status: "pending"
        });

        await submission.save();

        res.status(201).json({
            success: true,
            message: "Submission received! Your teacher will review it soon.",
            submission
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// =======================
// GET PENDING SUBMISSIONS
// =======================
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


// =======================
// GET ALL SUBMISSIONS
// =======================
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


// =======================
// APPROVE SUBMISSION
// =======================
router.post("/approve/:id", auth, teacherAuth, async (req, res) => {
    try {
        const { feedback } = req.body;

        const submission = await UserActivity.findById(req.params.id)
            .populate("activityId");

        if (!submission)
            return res.status(404).json({ error: "Submission not found" });

        if (submission.status === "approved")
            return res.status(400).json({ error: "Already approved" });

        submission.status = "approved";
        submission.feedback = feedback || "Great work!";
        await submission.save();

        const points = submission.activityId?.points || 10;

        await User.findByIdAndUpdate(submission.userId, {
            $inc: { ecoPoints: points }
        });

        res.json({
            success: true,
            message: "Submission approved and points added"
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// =======================
// REJECT SUBMISSION
// =======================
router.post("/reject/:id", auth, teacherAuth, async (req, res) => {
    try {
        const { feedback } = req.body;

        const submission = await UserActivity.findById(req.params.id);

        if (!submission)
            return res.status(404).json({ error: "Submission not found" });

        submission.status = "rejected";
        submission.feedback = feedback || "Please try again.";
        await submission.save();

        res.json({
            success: true,
            message: "Submission rejected"
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// =======================
// GET USER SUBMISSIONS
// =======================
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