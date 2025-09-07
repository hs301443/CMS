import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({

    name: { type: String, required: true },
    isActive: { type: Boolean, default: true}


}, { timestamps: true });

export const ActivityModel = mongoose.model('Activity', activitySchema);