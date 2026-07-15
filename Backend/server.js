const { MongoClient, ObjectId } = require("mongodb");
const express = require("express");

const uri = "mongodb://admin:password@localhost:27017/?authSource=admin";
const dbclient = new MongoClient(uri);
const app = express();
const PORT = 3999;

const path = require("path");

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
        directionsCollection = db.collection("directions"); //find your room

    } catch (err) {
        console.error("MongoDB Error:", err);
        process.exit(1);
    }
}

app.use(express.static(path.join(__dirname, "../Frontend")));
//find your room
app.get("/api/direction", async (req, res) => {
    try {
        const building = req.query.building;
        const gate = req.query.gate;

        if (!building || !gate) {
            return res.status(400).json({ error: "building and gate are required." });
        }

        const direction = await directionsCollection.findOne({ building, gate });

        if (!direction) {
            return res.status(404).json({ error: "No photo saved for this building/gate yet." });
        }

        res.json({
            image: direction.image
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// find your room
app.post("/api/direction", async (req, res) => {
    try {
        const { building, gate, image } = req.body;

        if (!building || !gate) {
            return res.status(400).json({ error: "building and gate are required." });
        }

        const result = await directionsCollection.updateOne(
            { building, gate },
            { $set: { building, gate, image: image || null } },
            { upsert: true }
        );

        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

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

//for admin
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
app.delete("/api/report/:building", async (req, res) => {
    try {
        const result = await reportsCollection.deleteOne({
            building: req.params.building
        });

        res.json(result);
        console.log(result);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});
app.delete("/api/report/:queueLength", async (req, res) => {
    try {
        const result = await reportsCollection.deleteOne({
            queueLength: req.params.queueLength
        });

        res.json(result);
        console.log(result);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});
app.delete("/api/report/:userId", async (req, res) => {
    try {
        const result = await reportsCollection.deleteOne({
            userId: req.params.userId
        });

        res.json(result);
        console.log(result);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

app.get("/api/report/:building", async (req, res) => {
    try {
        const result = await reportsCollection.find({
            building: req.params.building
        }).toArray();

        res.json(result);
        console.log(result);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});
app.get("/api/report/:queueLength", async (req, res) => {
    try {
        const result = await reportsCollection.find({
            queueLength: req.params.queueLength
        }).toArray();

        res.json(result);
        console.log(result);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});
app.get("/api/report/all", async (req, res) => {
    try {
        const report = await reportsCollection.find().toArray();
        res.json(report);
        console.log(report);
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