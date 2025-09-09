"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWebsiteStatus = exports.getWebsiteById = exports.getAllWebsites = void 0;
const websites_1 = require("../../models/shema/websites");
const index_1 = require("../../Errors/index");
const BadRequest_1 = require("../../Errors/BadRequest");
const NotFound_1 = require("../../Errors/NotFound");
const response_1 = require("../../utils/response");
const getAllWebsites = async (req, res) => {
    if (!req.user || req.user.role !== "admin")
        throw new index_1.UnauthorizedError("Access denied");
    const websites = await websites_1.WebsiteModel.find()
        .populate("userId", "name email")
        .populate("templateId", "name")
        .populate("activitiesId", "name");
    (0, response_1.SuccessResponse)(res, { message: "All websites fetched successfully", websites });
};
exports.getAllWebsites = getAllWebsites;
const getWebsiteById = async (req, res) => {
    if (!req.user || req.user.role !== "admin")
        throw new index_1.UnauthorizedError("Access denied");
    const { id } = req.params;
    if (!id)
        throw new BadRequest_1.BadRequest("Website ID is required");
    const website = await websites_1.WebsiteModel.findById(id)
        .populate("userId", "name email")
        .populate("templateId", "name")
        .populate("activitiesId", "name");
    if (!website)
        throw new NotFound_1.NotFound("Website not found");
    (0, response_1.SuccessResponse)(res, { message: "Website fetched successfully", website });
};
exports.getWebsiteById = getWebsiteById;
const updateWebsiteStatus = async (req, res) => {
    if (!req.user || req.user.role !== "admin")
        throw new index_1.UnauthorizedError("Access denied");
    const { id } = req.params;
    const { status, rejected_reason } = req.body;
    if (!id)
        throw new BadRequest_1.BadRequest("Website ID is required");
    if (!["approved", "rejected"].includes(status))
        throw new BadRequest_1.BadRequest("Status must be 'approved' or 'rejected'");
    const website = await websites_1.WebsiteModel.findById(id);
    if (!website)
        throw new NotFound_1.NotFound("Website not found");
    website.status = status;
    if (status === "rejected") {
        website.rejected_reason = rejected_reason || "Not specified";
    }
    await website.save();
    (0, response_1.SuccessResponse)(res, { message: "Website status updated successfully", website });
};
exports.updateWebsiteStatus = updateWebsiteStatus;
