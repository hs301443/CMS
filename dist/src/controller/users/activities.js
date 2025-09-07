"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActivityById = exports.getAllActivities = void 0;
const activities_1 = require("../../models/shema/activities");
const BadRequest_1 = require("../../Errors/BadRequest");
const Errors_1 = require("../../Errors");
const response_1 = require("../../utils/response");
const Errors_2 = require("../../Errors");
const getAllActivities = async (req, res) => {
    if (!req.user)
        throw new Errors_2.UnauthorizedError("user is not authenticated");
    const activities = await activities_1.ActivityModel.find({ isActive: true });
    (0, response_1.SuccessResponse)(res, { message: "All activities fetched successfully", activities });
};
exports.getAllActivities = getAllActivities;
const getActivityById = async (req, res) => {
    if (!req.user)
        throw new Errors_2.UnauthorizedError("user is not authenticated");
    const { id } = req.params;
    if (!id)
        throw new BadRequest_1.BadRequest("Please provide activity id");
    const activity = await activities_1.ActivityModel.findById(id);
    if (!activity)
        throw new Errors_1.NotFound("Activity not found");
    (0, response_1.SuccessResponse)(res, { message: "Activity fetched successfully", activity });
};
exports.getActivityById = getActivityById;
