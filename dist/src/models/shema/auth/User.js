"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const mongoose_2 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.Schema({
    name: { type: String, },
    email: { type: String, unique: true },
    password: { type: String },
    phonenumber: { type: String },
    isVerified: { type: Boolean, default: false },
    googleId: { type: String, unique: true, sparse: true },
    planId: { type: mongoose_2.default.Schema.Types.ObjectId, ref: 'Plan', default: null },
    first_time_byer: { type: Boolean, default: true },
}, { timestamps: true, });
exports.UserModel = mongoose_2.default.model('User', UserSchema);
