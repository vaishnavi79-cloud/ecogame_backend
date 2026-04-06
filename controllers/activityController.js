const UserActivity = require("../models/UserActivity");

exports.completeActivity = async (req, res) => {
    try {
        const { activityId, proofImage } = req.body;

        const submission = new UserActivity({
            userId: req.user.id,
            activityId,
            proofImage
        });

        await submission.save();

        res.json({
            success: true,
            message: "Activity submitted for review",
            submission
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};