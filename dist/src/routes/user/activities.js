"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const activities_1 = require("../../controller/users/activities");
const authenticated_1 = require("../../middlewares/authenticated");
const router = (0, express_1.Router)();
router.get("/", authenticated_1.authenticated, activities_1.getAllActivities);
router.get("/:id", authenticated_1.authenticated, activities_1.getActivityById);
exports.default = router;
