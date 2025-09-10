"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateplanSchema = exports.CreateplanSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.CreateplanSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    price_monthly: joi_1.default.number().optional(),
    price_quarterly: joi_1.default.number().optional(),
    price_semi_annually: joi_1.default.number().optional(),
    price_annually: joi_1.default.number().optional(),
    website_limit: joi_1.default.number().optional(),
});
exports.UpdateplanSchema = joi_1.default.object({
    name: joi_1.default.string().optional(),
    price_monthly: joi_1.default.number().optional(),
    price_quarterly: joi_1.default.number().optional(),
    price_semi_annually: joi_1.default.number().optional(),
    price_annually: joi_1.default.number().optional(),
    website_limit: joi_1.default.number().optional(),
});
