const { MongoClient, ObjectId } = require("mongodb");
const express = require("express");

const uri = "mongodb://admin:password@localhost:27017/?authSource=admin";
const dbclient = new MongoClient(uri);
const app = express();
const PORT = 3999;

app.use(express.json());

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




app.get("/report", async (req, res) => {
    try {
        const report = await reportsCollection.find().toArray();

        res.json(report);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});
app.post("/report", async (req, res) => {
    try {
        const result = await reportsCollection.insertOne(req.body);

        res.status(201).json({
            message: "Report received!",
            insertedId: result.insertedId
        });

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});
app.delete("/report/:id", async (req, res) => {
    try {
        const result = await reportsCollection.deleteOne({
            _id: new ObjectId(req.params.id)
        });

        res.json(result);

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});




app.get("/profile", async (req, res) => {
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
                image: profiles.image,
            });
        }
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});
app.post("/profile", async (req, res) => {
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
app.delete("/profile", async (req, res) => {
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