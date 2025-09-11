"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityModel = void 0;
// Activity Schema
const mongoose_1 = __importDefault(require("mongoose"));
const activitySchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });
activitySchema.virtual("templates", {
    ref: "Template",
    localField: "_id",
    foreignField: "activityId",
});
activitySchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
});
activitySchema.set("toObject", {
    virtuals: true,
    versionKey: false,
});
activitySchema.set("id", false);
exports.ActivityModel = mongoose_1.default.model("Activity", activitySchema);
