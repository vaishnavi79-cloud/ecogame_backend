const Badge = require('../models/Badge');
const User = require('../models/User');

const checkAndAwardBadges = async (userId) => {
    const user = await User.findById(userId).populate('badgesEarned');

    // Get all badges
    const badges = await Badge.find();

    let newBadges = [];

    for (let badge of badges) {

        const alreadyEarned = user.badgesEarned.some(
            b => b._id.toString() === badge._id.toString()
        );

        if (!alreadyEarned && user.ecoPoints >= badge.requiredPoints) {
            user.badgesEarned.push(badge._id);
            newBadges.push(badge.name);
        }
    }

    await user.save();

    return newBadges;
};

module.exports = checkAndAwardBadges;