const { MongoClient, ObjectId } = require("mongodb");
const express = require("express");

const uri = "mongodb://admin:password@localhost:27017/?authSource=admin";
const dbclient = new MongoClient(uri);
const app = express();
const PORT = 3999;

app.use(express.json());

// cors
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

async function MongoConnect() {
    try {
        await dbclient.connect();

        console.log("Connected to MongoDB");

        const db = dbclient.db("Main");

        reportsCollection = db.collection("reports");
        profilesCollection = db.collection("profiles");

    } catch (err) {
        console.error("MongoDB Error:", err);
        process.exit(1);
    }
}




app.get("/api/report", async (req, res) => {
    try {
        const report = await reportsCollection.find({
            timestamp: {        //Only get reports created less than or equal to 30 min
                $gte: Date.now() - 1800000
            }
        }).toArray();

        res.json(report);
        console.log(report);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});
app.get("/api/report/:user", async (req, res) => {
    try {
        const result = await reportsCollection.find({
            userId: req.params.user
        }).toArray();

        res.json(result);
        console.log(result);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});
app.post("/api/report", async (req, res) => {
    try {
        const report = req.body;

        // Validate fields
        if (
            typeof report.building !== "string" ||
            typeof report.elevator !== "string" ||
            typeof report.queueLength !== "string" ||
            typeof report.userId !== "string" ||
            report.building.trim() === "" ||
            report.elevator.trim() === "" ||
            report.userId.trim() === "" ||
            !["short", "medium", "long"].includes(report.queueLength)
        ) {
            return res.status(400).json({
                error: "Invalid report format."
            });
        }

        const result = await reportsCollection.insertOne({
            id: crypto.randomUUID(),
            building: report.building,
            elevator: report.elevator,
            queueLength: report.queueLength,
            timestamp: Date.now(),
            userId: report.userId
        });

        res.status(201).json(result);

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});
app.delete("/api/report/:id", async (req, res) => {
    try {
        const result = await reportsCollection.deleteOne({
            _id: new ObjectId(req.params.id)
        });

        res.json(result);
        console.log(result);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});




app.get("/api/auth", async (req, res) => {
    try {
        const profiles = await profilesCollection.findOne({
            username: req.body.username,
            password: req.body.password
        });

        if (profiles == null) {
            res.send("Invalid Username or Password")
        } else {
            res.json({
                username: profiles.username,
                email: profiles.email,
                role: profiles.role,
                image: profiles.image,
            });
        }
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});
app.post("/api/register", async (req, res) => {
    try {
        const result = await profilesCollection.insertOne(req.body);

        res.status(201).json({
            message: "Profile received!",
            insertedId: result.insertedId
        });

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});
app.delete("/api/profile", async (req, res) => {
    try {
        const result = await profilesCollection.deleteOne({
            username: req.body.username,
            password: req.body.password
        });

        res.json(result);

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});




async function StartServer() {
    await MongoConnect();

    app.listen(PORT, () => {
        console.log(`Running on http://localhost:${PORT}`);
    });
}

StartServer();