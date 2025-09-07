"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const TemplateSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    template_file_path: { type: String, required: true },
    Activities: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Activity' }],
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
exports.TemplateModel = mongoose_1.default.model('Template', TemplateSchema);
