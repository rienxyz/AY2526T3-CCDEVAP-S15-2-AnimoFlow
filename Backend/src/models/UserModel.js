const { getDB } = require("../config/database");

const COLLECTION = "users";

class UserModel {
    static async create(userData) {
        const db = getDB();
        const user = {
            email: userData.email.toLowerCase(),
            password: userData.password,
            role: userData.role || 'user',
            createdAt: Date.now()
        };
        
        const result = await db.collection(COLLECTION).insertOne(user);
        return { ...user, _id: result.insertedId };
    }

    static async findByEmail(email) {
        const db = getDB();
        return await db.collection(COLLECTION).findOne({ email: email.toLowerCase() });
    }

    static async findById(id) {
        const db = getDB();
        return await db.collection(COLLECTION).findOne({ _id: id });
    }

    static async updateRole(email, role) {
        const db = getDB();
        return await db.collection(COLLECTION).updateOne(
            { email: email.toLowerCase() },
            { $set: { role: role } }
        );
    }

    static async deleteByEmail(email) {
        const db = getDB();
        return await db.collection(COLLECTION).deleteOne({ email: email.toLowerCase() });
    }

    static async findAll() {
        const db = getDB();
        return await db.collection(COLLECTION).find().toArray();
    }

    static async findOrCreate(email, password, role = 'user') {
        const db = getDB();
        let user = await this.findByEmail(email);
        if (!user) {
            user = await this.create({ email, password, role });
        }
        return user;
    }
}

module.exports = UserModel;