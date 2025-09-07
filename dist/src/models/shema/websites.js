"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsiteModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const websiteSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    templateId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Template', required: true },
    demo_link: { type: String, required: true },
    project_path: { type: String, required: true },
    status: { type: String, enum: ['demo', 'approved', 'pending_admin_review', "rejected"], default: 'pending_admin_review' },
    rejected_reason: { type: String, }
}, { timestamps: true });
exports.WebsiteModel = mongoose_1.default.model('Website', websiteSchema);
