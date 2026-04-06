require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

const teachers = [
    {
        name: "Teacher One",
        email: "teacher1@ecoapp.com",
        password: "teacher123",
        school: "Eco School",
        role: "teacher"
    },
    {
        name: "Teacher Two",
        email: "teacher2@ecoapp.com",
        password: "teacher123",
        school: "Eco School",
        role: "teacher"
    },
    {
        name: "Teacher Three",
        email: "teacher3@ecoapp.com",
        password: "teacher123",
        school: "Eco School",
        role: "teacher"
    }
];

async function seedTeachers() {
    try {
        console.log("🔄 Connecting DB...");
        await mongoose.connect(process.env.MONGO_URI);

        for (const teacher of teachers) {

            const exists = await User.findOne({ email: teacher.email });

            if (exists) {
                console.log(`⚠️ ${teacher.email} already exists`);
                continue;
            }

            const newTeacher = new User(teacher);
            await newTeacher.save();

            console.log(`✅ Created: ${teacher.email}`);
        }

        console.log("🎉 Teacher seeding complete");
        process.exit();

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedTeachers();