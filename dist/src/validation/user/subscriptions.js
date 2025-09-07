"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSubscriptionSchema = exports.CreateSubscriptionSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.CreateSubscriptionSchema = joi_1.default.object({
    planId: joi_1.default.string().required(),
    startDate: joi_1.default.date().required(),
    endDate: joi_1.default.date().required(),
    websites_created_count: joi_1.default.number().optional(),
    websites_remaining_count: joi_1.default.number().optional(),
});
exports.UpdateSubscriptionSchema = joi_1.default.object({
    planId: joi_1.default.string().optional(),
    startDate: joi_1.default.date().optional(),
    endDate: joi_1.default.date().optional(),
    websites_created_count: joi_1.default.number().optional(),
    websites_remaining_count: joi_1.default.number().optional(),
});
