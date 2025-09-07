"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = __importDefault(require("./auth/index"));
const plans_1 = __importDefault(require("./plans"));
const payment_method_1 = __importDefault(require("./payment_method"));
const subscriptions_1 = __importDefault(require("./subscriptions"));
const activities_1 = __importDefault(require("./activities"));
const route = (0, express_1.Router)();
route.use("/auth", index_1.default);
route.use("/plans", plans_1.default);
route.use("/payment-method", payment_method_1.default);
route.use("/subscriptions", subscriptions_1.default);
route.use("/activities", activities_1.default);
exports.default = route;
