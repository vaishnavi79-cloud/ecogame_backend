const mongoose = require("mongoose");

const UserActivitySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    activityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Activity",
        required: true
    },
    moduleNumber: {
        type: Number,  // 1 to 7
    },
    proofImage: String,
    feedback: {
        type: String,  // teacher comment
        default: ""
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
    completedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("UserActivity", UserActivitySchema);