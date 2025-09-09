// Activity Schema
import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

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

export const ActivityModel = mongoose.model("Activity", activitySchema);
