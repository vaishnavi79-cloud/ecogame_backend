const Badge = require("../models/Badge");
const User = require("../models/User");

exports.checkAndAssignBadges = async (userId) => {

    const user = await User.findById(userId);
    const badges = await Badge.find();

    for (const badge of badges) {

        if (
            user.ecoPoints >= badge.requiredPoints &&
            !user.badges.includes(badge._id)
        ) {
            user.badges.push(badge._id);
        }
    }

    await user.save();
};