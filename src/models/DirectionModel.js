const { getDB } = require("../config/database");

const COLLECTION = "directions";

class DirectionModel {
    static async find(building, gate) {
        const db = getDB();
        return await db.collection(COLLECTION).findOne({ building, gate });
    }

    static async upsert(building, gate, image) {
        const db = getDB();
        return await db.collection(COLLECTION).updateOne(
            { building, gate },
            { $set: { building, gate, image: image || null } },
            { upsert: true }
        );
    }

    static async findAll() {
        const db = getDB();
        return await db.collection(COLLECTION).find().toArray();
    }

    static async findByBuilding(building) {
        const db = getDB();
        return await db.collection(COLLECTION).find({ building }).toArray();
    }

    static async deleteByBuilding(building) {
        const db = getDB();
        return await db.collection(COLLECTION).deleteMany({ building });
    }
}

module.exports = DirectionModel;