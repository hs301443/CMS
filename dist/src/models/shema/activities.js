"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityModel = void 0;
// Activity Schema
const mongoose_1 = __importDefault(require("mongoose"));
const activitySchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });
// 🔗 Virtual populate
activitySchema.virtual("templates", {
    ref: "Template",
    localField: "_id",
    foreignField: "activityId",
});
// ✅ إعدادات الإخراج
activitySchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
});
activitySchema.set("toObject", {
    virtuals: true,
    versionKey: false,
});
// ✅ إلغاء توليد id alias
activitySchema.set("id", false);
exports.ActivityModel = mongoose_1.default.model("Activity", activitySchema);
