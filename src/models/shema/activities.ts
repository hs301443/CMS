// Activity Schema
import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

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

export const ActivityModel = mongoose.model("Activity", activitySchema);
