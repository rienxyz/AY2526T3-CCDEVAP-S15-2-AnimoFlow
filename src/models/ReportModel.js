const { getDB } = require("../config/database");
const crypto = require("crypto");

const COLLECTION = "reports";

class ReportModel {
    static async create(reportData) {
        const db = getDB();
        const report = {
            id: crypto.randomUUID(),
            building: reportData.building,
            elevator: reportData.elevator,
            queueLength: reportData.queueLength,
            timestamp: Date.now(),
            userId: reportData.userId
        };
        
        const result = await db.collection(COLLECTION).insertOne(report);
        return { ...report, _id: result.insertedId };
    }

    static async findById(id) {
        const db = getDB();
        return await db.collection(COLLECTION).findOne({ id: id });
    }

    static async findRecent(limit = 30) {
        const db = getDB();
        const cutoff = Date.now() - (limit * 60 * 1000);
        return await db.collection(COLLECTION)
            .find({ timestamp: { $gte: cutoff } })
            .toArray();
    }

    static async findAll() {
        const db = getDB();
        return await db.collection(COLLECTION).find().toArray();
    }

    static async findByUser(userId) {
        const db = getDB();
        return await db.collection(COLLECTION)
            .find({ userId: userId })
            .toArray();
    }

    static async findByBuilding(building) {
        const db = getDB();
        return await db.collection(COLLECTION)
            .find({ building: building })
            .toArray();
    }

    static async findByStatus(queueLength) {
        const db = getDB();
        return await db.collection(COLLECTION)
            .find({ queueLength: queueLength })
            .toArray();
    }

    static async deleteById(id) {
        const db = getDB();
        return await db.collection(COLLECTION).deleteOne({ id: id });
    }

    static async deleteByBuilding(building) {
        const db = getDB();
        return await db.collection(COLLECTION).deleteMany({ building: building });
    }

    static async deleteByUser(userId) {
        const db = getDB();
        return await db.collection(COLLECTION).deleteMany({ userId: userId });
    }

    static async deleteAll() {
        const db = getDB();
        return await db.collection(COLLECTION).deleteMany({});
    }

    static async getAnalytics() {
        const db = getDB();
        const allReports = await this.findAll();
        
        const buildingCounts = {};
        const statusCounts = { short: 0, medium: 0, long: 0 };
        const users = new Set();
        
        allReports.forEach(r => {
            buildingCounts[r.building] = (buildingCounts[r.building] || 0) + 1;
            if (statusCounts.hasOwnProperty(r.queueLength)) {
                statusCounts[r.queueLength]++;
            }
            if (r.userId) users.add(r.userId);
        });

        const topBuildings = Object.entries(buildingCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, count]) => ({ name, count }));

        return {
            totalReports: allReports.length,
            activeReports: allReports.filter(r => (Date.now() - r.timestamp) <= 1800000).length,
            totalUsers: users.size,
            activeBuildings: Object.keys(buildingCounts).length,
            statusCounts,
            topBuildings,
            reportsByBuilding: buildingCounts
        };
    }
}

module.exports = ReportModel;