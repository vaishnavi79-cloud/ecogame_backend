const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* =======================
   MIDDLEWARE
======================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/uploads", express.static("uploads"));

// Debug Logger (helps detect route issues)
app.use((req, res, next) => {
    console.log("👉 Incoming:", req.method, req.url);
    next();
});

/* =======================
   DATABASE CONNECTION
======================= */
console.log("🔄 Connecting to MongoDB...");

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch(err => console.log("❌ MongoDB Error:", err));


/* =======================
   MODELS
======================= */
const User = require("./models/User");


/* =======================
   ROUTES IMPORT
======================= */
const activityRoutes = require('./routes/activityRoutes');
const badgeRoutes = require('./routes/badgeRoutes');
const userRoutes = require('./routes/userRoutes');
const reviewRoutes = require('./routes/reviewRoutes'); 

/* =======================
   ROUTES MOUNTING
======================= */
app.use("/api/activities", activityRoutes);
app.use("/api/badges", badgeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/review", reviewRoutes);


/* =======================
   TEST ROUTE
======================= */
app.get("/test", (req, res) => {
    res.json({ message: "Server working ✅" });
});


/* =======================
   AUTH ROUTES
======================= */
const jwt = require("jsonwebtoken");

// REGISTER
app.post("/api/auth/register", async (req, res) => {
    try {
        const { name, email, password, school } = req.body;

        if (!name || !email || !password || !school) {
            return res.status(400).json({ error: "All fields required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ error: "Email already registered" });

        const user = new User({ name, email, password, school });
        await user.save();

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// LOGIN
app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user)
            return res.status(404).json({ error: "User not found" });

        const isMatch = await user.comparePassword(password);
        if (!isMatch)
            return res.status(400).json({ error: "Incorrect password" });

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            success: true,
            message: "Login successful",
            token,
            user
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/test/submissions", async (req, res) => {
    try {
        const UserActivity = require("./models/UserActivity");
        const submissions = await UserActivity.find().populate("activityId");
        res.json(submissions);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

/* =======================
   404 HANDLER
======================= */
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});


/* =======================
   SERVER START
======================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📍 Test: http://localhost:${PORT}/test`);
});

