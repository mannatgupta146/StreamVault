import mongoose from "mongoose";

const MONGO_URI = "mongodb://127.0.0.1:27017/streamvault";

const promoteAdmin = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        const db = mongoose.connection.useDb('streamvault');
        
        const user = await db.collection('users').findOne({});
        if (user) {
            await db.collection('users').updateOne(
                { _id: user._id },
                { $set: { role: "admin" } }
            );
            console.log(`Successfully promoted ${user.email} to Admin!`);
        } else {
            console.log("No users found in the database. Please register an account first.");
        }
        
    } catch (err) {
        console.error("Error connecting to MongoDB:", err.message);
    } finally {
        await mongoose.disconnect();
    }
};

promoteAdmin();
