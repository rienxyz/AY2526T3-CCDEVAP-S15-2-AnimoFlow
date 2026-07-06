
const express = require("express");

const app = express();
const PORT = 3999;

//parse JSON request bodies
app.use(express.json());

// GET
app.get("/report", (req, res) => {
    res.send("Hello from REST API!");
});

app.post("/report", (req, res) => {
    res.send("Hello from REST API!");
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// const { MongoClient, ObjectId } = require("mongodb");

// const mongoclient = "mongodb://admin:password@localhost:27017/?authSource=admin";

// async function main() {
//     const client = new MongoClient(mongoclient);

//     try {
//         await client.connect();
//         console.log("Connected to MongoDB");

//         // Select database
//         const db = client.db("Main");

//         // Select collection
//         const users = db.collection("reports");


//     } catch (err) {
//         console.error(err);
//     } finally {
//         await client.close();
//         console.log("\nConnection Closed.");
//     }
// }

// main();