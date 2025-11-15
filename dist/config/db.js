"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let isConnected = false;
async function connectDB() {
    if (isConnected) {
        console.log("⚡ Already connected to MongoDB");
        return;
    }
    try {
        await mongoose_1.default.connect(process.env.MONGO_URL);
        isConnected = true;
        console.log("🧠 MongoDB connected successfully");
    }
    catch (err) {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1);
    }
}
//# sourceMappingURL=db.js.map