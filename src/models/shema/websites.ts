import mongoose from "mongoose";

const websiteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Template', required: true },
  demo_link: { type: String, required: true },
  project_path: { type: String, required: true },
  status:{ type: String, enum: ['demo', 'approved', 'pending_admin_review',"rejected"], default: 'pending_admin_review' },
  rejected_reason: { type: String,}
}, { timestamps: true });

export const WebsiteModel = mongoose.model('Website', websiteSchema);