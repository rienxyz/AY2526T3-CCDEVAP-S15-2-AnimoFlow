const DirectionModel = require("../models/DirectionModel");

exports.getDirection = async (req, res) => {
    try {
        const building = req.query.building;
        const gate = req.query.gate;

        if (!building || !gate) {
            return res.status(400).json({ error: "building and gate are required." });
        }

        const direction = await DirectionModel.find(building, gate);

        if (!direction) {
            return res.status(404).json({ error: "No photo saved for this building/gate yet." });
        }

        res.json({ image: direction.image });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.upsertDirection = async (req, res) => {
    try {
        const { building, gate, image } = req.body;

        if (!building || !gate) {
            return res.status(400).json({ error: "building and gate are required." });
        }

        const result = await DirectionModel.upsert(building, gate, image);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllDirections = async (req, res) => {
    try {
        const directions = await DirectionModel.findAll();
        res.json(directions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};