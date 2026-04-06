const UserActivity = require("../models/UserActivity");
const Activity = require("../models/Activity");
const User = require("../models/User");
const { checkAndAssignBadges } = require("../utils/badgeService");

// GET pending submissions
exports.getPendingActivities = async (req, res) => {

    const activities = await UserActivity
        .find({ status: "pending" })
        .populate("userId", "name email")
        .populate("activityId");

    res.json(activities);
};

// APPROVE activity
exports.approveActivity = async (req, res) => {
    try {
        const { id } = req.params;

        const submission = await UserActivity.findById(id)
            .populate("activityId");

        submission.status = "approved";
        await submission.save();

        // Add points
        const user = await User.findById(submission.userId);

        user.ecoPoints += submission.activityId.pointsReward;
        await user.save();

        // check badges
        await checkAndAssignBadges(user._id);

        res.json({ success: true });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};