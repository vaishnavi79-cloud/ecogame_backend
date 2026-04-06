const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        // No token
        if (!authHeader)
            return res.status(401).json({ error: "No token provided" });

        // Remove Bearer
        const token = authHeader.split(" ")[1];

        if (!token)
            return res.status(401).json({ error: "Invalid token format" });

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // ✅ VERY IMPORTANT
        req.user = decoded;

        next();
    } catch (err) {
        res.status(401).json({ error: "Token invalid" });
    }
};