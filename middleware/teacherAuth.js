const jwt = require("jsonwebtoken");
const User = require("../models/User");

const teacherAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                error: "No token provided"
            });
        }

        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // find user
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        // allow only teachers
        if (user.role !== "teacher") {
            return res.status(403).json({
                error: "Access denied. Teachers only."
            });
        }

        req.userId = user._id;
        req.user = user;

        next();
    } catch (err) {
        res.status(401).json({
            error: "Invalid token"
        });
    }
};

module.exports = teacherAuth;