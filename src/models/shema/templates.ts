import mongoose from "mongoose";

const TemplateSchema = new mongoose.Schema({
  name:{ type: String, required: true },
  template_file_path:{ type: String, required: true },
  isActive:{type: Boolean, default: true},

}, { timestamps: true }); 

export const TemplateModel = mongoose.model('Template', TemplateSchema);