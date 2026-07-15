// ============================================================
// CCDEVAP-S15-2-AnimoFlow.js
// Database Seed Script for AnimoFlow
// ============================================================
// Or: node CCDEVAP-S15-2-AnimoFlow.js
// ============================================================

const { MongoClient } = require("mongodb");

// Connection URI
const uri = "mongodb://admin:password@localhost:27017/?authSource=admin";
const client = new MongoClient(uri);

async function seedDatabase() {
    try {
        await client.connect();
        console.log("✅ Connected to MongoDB");

        const db = client.db("Main");

    
        const users = [
            {
                email: "admin@dlsu.edu.ph",
                password: "admin123",
                role: "admin",
                createdAt: Date.now() - 600000  // 10 min ago
            },
            {
                email: "juan.delacruz@dlsu.edu.ph",
                password: "password123",
                role: "user",
                createdAt: Date.now() - 1200000  // 20 min ago
            },
            {
                email: "maria.santos@dlsu.edu.ph",
                password: "password123",
                role: "user",
                createdAt: Date.now() - 1800000  // 30 min ago
            },
            {
                email: "carlos.reyes@dlsu.edu.ph",
                password: "password123",
                role: "user",
                createdAt: Date.now() - 2400000  // 40 min ago
            },
            {
                email: "miguel.tan@dlsu.edu.ph",
                password: "password123",
                role: "user",
                createdAt: Date.now() - 3000000  // 50 min ago
            },
            {
                email: "angela.lim@dlsu.edu.ph",
                password: "password123",
                role: "user",
                createdAt: Date.now() - 3600000  // 1 hour ago
            }
        ];


        await db.collection("users").deleteMany({});

        // Insert users
        const userResult = await db.collection("users").insertMany(users);
        console.log(`✅ Inserted ${userResult.insertedCount} users`);

        const now = Date.now();
        const reports = [
            {
                id: "rpt-001",
                building: "St. La Salle Hall",
                elevator: "LS-East-1",
                queueLength: "short",
                timestamp: now - 120000,  // 2 min ago
                userId: "juan.delacruz@dlsu.edu.ph"
            },
            {
                id: "rpt-002",
                building: "Henry Sy Hall",
                elevator: "H-Ground-A",
                queueLength: "long",
                timestamp: now - 300000,  // 5 min ago
                userId: "maria.santos@dlsu.edu.ph"
            },
            {
                id: "rpt-003",
                building: "Yuchengco Hall",
                elevator: "Y-B",
                queueLength: "medium",
                timestamp: now - 480000,  // 8 min ago
                userId: "carlos.reyes@dlsu.edu.ph"
            },
            {
                id: "rpt-004",
                building: "Andrew Gonzalez Hall",
                elevator: "A-Public-3",
                queueLength: "long",
                timestamp: now - 600000,  // 10 min ago
                userId: "juan.delacruz@dlsu.edu.ph"
            },
            {
                id: "rpt-005",
                building: "Velasco Hall",
                elevator: "V-1",
                queueLength: "short",
                timestamp: now - 900000,  // 15 min ago
                userId: "miguel.tan@dlsu.edu.ph"
            },
            {
                id: "rpt-006",
                building: "Gokongwei Hall",
                elevator: "G-1",
                queueLength: "medium",
                timestamp: now - 1200000, // 20 min ago
                userId: "angela.lim@dlsu.edu.ph"
            },
            {
                id: "rpt-007",
                building: "Razon Sports Center",
                elevator: "R-A",
                queueLength: "short",
                timestamp: now - 1500000, // 25 min ago
                userId: "maria.santos@dlsu.edu.ph"
            }
        ];


        await db.collection("reports").deleteMany({});

        // Insert reports
        const reportResult = await db.collection("reports").insertMany(reports);
        console.log(`✅ Inserted ${reportResult.insertedCount} reports`);

        const profiles = [
            {
                userId: "juan.delacruz@dlsu.edu.ph",
                displayName: "Juan Dela Cruz",
                department: "College of Computer Studies",
                yearLevel: "4th Year",
                totalReports: 2,
                activeReports: 2
            },
            {
                userId: "maria.santos@dlsu.edu.ph",
                displayName: "Maria Santos",
                department: "College of Engineering",
                yearLevel: "3rd Year",
                totalReports: 2,
                activeReports: 2
            },
            {
                userId: "carlos.reyes@dlsu.edu.ph",
                displayName: "Carlos Reyes",
                department: "College of Business",
                yearLevel: "2nd Year",
                totalReports: 1,
                activeReports: 1
            },
            {
                userId: "miguel.tan@dlsu.edu.ph",
                displayName: "Miguel Tan",
                department: "College of Science",
                yearLevel: "4th Year",
                totalReports: 1,
                activeReports: 1
            },
            {
                userId: "angela.lim@dlsu.edu.ph",
                displayName: "Angela Lim",
                department: "College of Liberal Arts",
                yearLevel: "1st Year",
                totalReports: 1,
                activeReports: 1
            }
        ];


        await db.collection("profiles").deleteMany({});

        // Insert profiles
        const profileResult = await db.collection("profiles").insertMany(profiles);
        console.log(`✅ Inserted ${profileResult.insertedCount} profiles`);

       
        console.log("ℹ️  Directions already seeded via seed-directions.js");

        // ============================================================
        // SUMMARY
        // ============================================================
        console.log("\n========================================");
        console.log("✅ DATABASE SEED COMPLETE!");
        console.log("========================================");
        console.log(`📊 Users: ${userResult.insertedCount}`);
        console.log(`📊 Reports: ${reportResult.insertedCount}`);
        console.log(`📊 Profiles: ${profileResult.insertedCount}`);
        console.log("========================================\n");

    } catch (err) {
        console.error("❌ Error seeding database:", err);
    } finally {
        await client.close();
        console.log("🔒 MongoDB connection closed");
    }
}

// Run the seed function
seedDatabase();