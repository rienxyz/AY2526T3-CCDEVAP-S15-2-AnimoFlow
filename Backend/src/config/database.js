const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI || "mongodb://admin:password@localhost:27017/?authSource=admin";
const dbName = process.env.DB_NAME || "Main";

let db = null;
let client = null;

async function connectDB() {
    try {
        client = new MongoClient(uri);
        await client.connect();
        db = client.db(dbName);
        console.log("✅ Connected to MongoDB");
        
        // Create collections if they don't exist
        await db.createCollection("reports", { capped: false });
        await db.createCollection("users", { capped: false });
        await db.createCollection("directions", { capped: false });
        await db.createCollection("profiles", { capped: false });
        await db.createCollection("counters", { capped: false });
        
        // Create indexes
        try {
            await db.collection("users").createIndex({ email: 1 }, { unique: true });
        } catch (e) {}
        
        // Seed default admin user if not exists
        const adminExists = await db.collection("users").findOne({ email: 'admin@dlsu.edu.ph' });
        if (!adminExists) {
            await db.collection("users").insertOne({
                email: 'admin@dlsu.edu.ph',
                password: 'admin123',
                role: 'admin',
                createdAt: Date.now()
            });
            console.log('✅ Default admin user created: admin@dlsu.edu.ph / admin123');
        }
        
        return db;
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1);
    }
}

function getDB() {
    if (!db) {
        throw new Error("Database not connected. Call connectDB() first.");
    }
    return db;
}

function getClient() {
    return client;
}

module.exports = { connectDB, getDB, getClient };