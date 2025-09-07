"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteActivity = exports.updateActivity = exports.getActivityById = exports.getAllActivities = exports.createActivity = void 0;
const activities_1 = require("../../models/shema/activities");
const BadRequest_1 = require("../../Errors/BadRequest");
const Errors_1 = require("../../Errors");
const response_1 = require("../../utils/response");
const Errors_2 = require("../../Errors");
const createActivity = async (req, res) => {
    if (!req.user || req.user.role !== 'admin')
        throw new Errors_2.UnauthorizedError("Access denied");
    const { name, isActive } = req.body;
    const existingActivity = await activities_1.ActivityModel.findOne({ name });
    if (existingActivity)
        throw new BadRequest_1.BadRequest("Activity with this name already exists");
    const activity = new activities_1.ActivityModel({ name, isActive });
    await activity.save();
    (0, response_1.SuccessResponse)(res, { message: "Activity created successfully", activity });
};
exports.createActivity = createActivity;
const getAllActivities = async (req, res) => {
    if (!req.user || req.user.role !== 'admin')
        throw new Errors_2.UnauthorizedError("Access denied");
    const activities = await activities_1.ActivityModel.find();
    (0, response_1.SuccessResponse)(res, { message: "All activities fetched successfully", activities });
};
exports.getAllActivities = getAllActivities;
const getActivityById = async (req, res) => {
    if (!req.user || req.user.role !== 'admin')
        throw new Errors_2.UnauthorizedError("Access denied");
    const { id } = req.params;
    if (!id)
        throw new BadRequest_1.BadRequest("Please provide activity id");
    const activity = await activities_1.ActivityModel.findById(id);
    if (!activity)
        throw new Errors_1.NotFound("Activity not found");
    (0, response_1.SuccessResponse)(res, { message: "Activity fetched successfully", activity });
};
exports.getActivityById = getActivityById;
const updateActivity = async (req, res) => {
    if (!req.user || req.user.role !== 'admin')
        throw new Errors_2.UnauthorizedError("Access denied");
    const { id } = req.params;
    if (!id)
        throw new BadRequest_1.BadRequest("Please provide activity id");
    const { name, isActive } = req.body;
    const activity = await activities_1.ActivityModel.findByIdAndUpdate(id, { name, isActive }, { new: true });
    if (!activity)
        throw new Errors_1.NotFound("Activity not found");
    (0, response_1.SuccessResponse)(res, { message: "Activity updated successfully", activity });
};
exports.updateActivity = updateActivity;
const deleteActivity = async (req, res) => {
    if (!req.user || req.user.role !== 'admin')
        throw new Errors_2.UnauthorizedError("Access denied");
    const { id } = req.params;
    if (!id)
        throw new BadRequest_1.BadRequest("Please provide activity id");
    const activity = await activities_1.ActivityModel.findByIdAndDelete(id);
    if (!activity)
        throw new Errors_1.NotFound("Activity not found");
    (0, response_1.SuccessResponse)(res, { message: "Activity deleted successfully" });
};
exports.deleteActivity = deleteActivity;
