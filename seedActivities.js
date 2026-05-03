require("dotenv").config();
const mongoose = require("mongoose");
const Activity = require("./models/Activity");

const activities = [
    {
        name: "Identify Natural vs Man-made Elements",
        description: "Go outside and identify 5 natural elements and 5 man-made elements around you. Take a photo showing both.",
        category: "waste_segregation",
        pointsReward: 10,
        difficultyLevel: "easy",
        duration: 15,
        gameType: "photo_proof",
        moduleNumber: 1,
        instructions: [
            "Go outside your home or school",
            "Find 5 natural elements like trees, soil, water, rocks, sky",
            "Find 5 man-made elements like buildings, roads, wires, vehicles",
            "Take a clear photo showing both types",
            "Submit the photo as proof"
        ]
    },
    {
        name: "Greenhouse Effect in Daily Life",
        description: "Take a photo of any activity in your daily life that contributes to or reduces greenhouse gas emissions.",
        category: "energy_saving",
        pointsReward: 10,
        difficultyLevel: "easy",
        duration: 15,
        gameType: "photo_proof",
        moduleNumber: 2,
        instructions: [
            "Think about daily activities that affect greenhouse gases",
            "Examples: using AC, driving, using solar panels, cycling",
            "Take a photo of one such activity",
            "Submit the photo as proof"
        ]
    },
    {
        name: "Waste Sorting at Home",
        description: "Sort waste at home into wet, dry, and e-waste. Take a photo of the sorted waste bins.",
        category: "waste_segregation",
        pointsReward: 10,
        difficultyLevel: "easy",
        duration: 20,
        gameType: "photo_proof",
        moduleNumber: 3,
        instructions: [
            "Collect waste from your home",
            "Sort into wet waste (food scraps), dry waste (paper, plastic), e-waste (batteries, cables)",
            "Place them in separate bins or bags",
            "Take a photo showing the sorted waste",
            "Submit the photo as proof"
        ]
    },
    {
        name: "Fix Water Wastage",
        description: "Find one example of water wastage at home or school and fix it. Take a before and after photo.",
        category: "water_conservation",
        pointsReward: 10,
        difficultyLevel: "medium",
        duration: 20,
        gameType: "photo_proof",
        moduleNumber: 4,
        instructions: [
            "Look for water wastage at home — dripping taps, overflowing tanks, open pipes",
            "Take a before photo showing the wastage",
            "Fix the issue — close the tap, report leakage, turn off the pump",
            "Take an after photo showing the fix",
            "Submit the photo as proof"
        ]
    },
    {
        name: "Spot Renewable Energy Sources",
        description: "Find 3 renewable energy sources in your area such as solar panels or windmills. Take a photo.",
        category: "energy_saving",
        pointsReward: 10,
        difficultyLevel: "medium",
        duration: 25,
        gameType: "photo_proof",
        moduleNumber: 5,
        instructions: [
            "Walk around your neighbourhood or search online for local renewable energy",
            "Look for solar panels on rooftops, windmills, biogas plants",
            "Photograph at least 1 renewable energy source you find",
            "Submit the photo as proof"
        ]
    },
    {
        name: "Biodiversity in Your Area",
        description: "Visit a nearby park or garden. Photograph at least 5 different species of plants or animals.",
        category: "tree_planting",
        pointsReward: 10,
        difficultyLevel: "easy",
        duration: 30,
        gameType: "photo_proof",
        moduleNumber: 6,
        instructions: [
            "Visit a nearby park, garden, or open area",
            "Look for different species of plants, insects, birds, or animals",
            "Photograph at least 5 different species",
            "Submit the photo as proof"
        ]
    },
    {
        name: "Eco-friendly Shopping",
        description: "Go shopping and choose at least 3 eco-friendly products over regular ones. Take a photo of your choices.",
        category: "waste_segregation",
        pointsReward: 10,
        difficultyLevel: "easy",
        duration: 20,
        gameType: "photo_proof",
        moduleNumber: 7,
        instructions: [
            "Visit a local shop or supermarket",
            "Look for eco-friendly alternatives — reusable bags, organic products, less packaging",
            "Choose at least 3 eco-friendly products",
            "Take a photo of your chosen products",
            "Submit the photo as proof"
        ]
    }
];

async function seedActivities() {
    try {
        console.log("🔄 Connecting to DB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected!");

        for (const activity of activities) {
            const exists = await Activity.findOne({ moduleNumber: activity.moduleNumber });

            if (exists) {
                console.log(`⚠️  Module ${activity.moduleNumber} already exists — skipping`);
                continue;
            }

            const newActivity = new Activity(activity);
            await newActivity.save();
            console.log(`✅ Created: Module ${activity.moduleNumber} — ${activity.name}`);
        }

        console.log("🎉 All activities seeded successfully!");

    } catch (err) {
        console.error("❌ Seeding failed:", err.message);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log("🔌 DB disconnected");
        process.exit(0);
    }
}

seedActivities();