
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    school: {
        type: String,
        required: true,
    },
    role: {
    type: String,
    enum: ["student", "teacher"],
    default: "student"
    },
    ecoPoints: {
        type: Number,
        default: 0,
    },
    currentLevel: {
        type: Number,
        default: 1,
    },
    badgesEarned: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Badge',
        },
    ],
    activitiesCompleted: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Activity',
        },
    ],
    profileImage: {
        type: String,
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// FIXED: Hash password before saving
UserSchema.pre('save', async function () {
    // If password is not modified, skip hashing
    if (!this.isModified('password')) return;
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (err) {
        throw err;
    }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);