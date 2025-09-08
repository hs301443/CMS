"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTemplateSchema = exports.createTemplateSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createTemplateSchema = joi_1.default.object({
    name: joi_1.default.string().min(3).max(100).required(),
    isActive: joi_1.default.boolean().default(true),
});
exports.updateTemplateSchema = joi_1.default.object({
    name: joi_1.default.string().min(3).max(100),
    isActive: joi_1.default.boolean(),
}).min(1);
