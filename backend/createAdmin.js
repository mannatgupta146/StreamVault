import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGO_URI = "mongodb://127.0.0.1:27017/streamvault";

const createAdmin = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        const db = mongoose.connection.useDb('streamvault');
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        await db.collection('users').updateOne(
            { email: "admin@123.com" },
            { 
               $set: { 
                   name: "Master Admin",
                   email: "admin@123.com",
                   password: hashedPassword,
                   role: "admin",
                   banned: false,
                   favorites: [],
                   history: []
               } 
            },
            { upsert: true }
        );
        console.log(`Successfully created or updated admin@123.com with password admin123!`);
        
    } catch (err) {
        console.error("Error connecting to MongoDB:", err.message);
    } finally {
        await mongoose.disconnect();
    }
};

createAdmin();
