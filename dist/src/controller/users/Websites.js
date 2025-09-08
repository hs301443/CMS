"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWebsiteById = exports.getAllWebsites = exports.createWebsite = void 0;
const subscriptions_1 = require("../../models/shema/subscriptions");
const websites_1 = require("../../models/shema/websites");
const index_1 = require("../../Errors/index");
const BadRequest_1 = require("../../Errors/BadRequest");
const NotFound_1 = require("../../Errors/NotFound");
const response_1 = require("../../utils/response");
const createWebsite = async (req, res) => {
    if (!req.user)
        throw new index_1.UnauthorizedError("User not authenticated");
    const { templateId, activitiesId, demo_link, project_path } = req.body;
    if (!templateId || !demo_link || !project_path) {
        throw new BadRequest_1.BadRequest("Please provide all required fields");
    }
    // 🔹 1. نجيب subscription الخاص باليوزر
    const subscription = await subscriptions_1.SubscriptionModel.findOne({ userId: req.user.id })
        .sort({ createdAt: -1 });
    if (!subscription) {
        throw new BadRequest_1.BadRequest("You do not have an active subscription");
    }
    // 🔹 2. نعمل تشيك على الـ remaining
    if (subscription.websites_remaining_count <= 0) {
        throw new BadRequest_1.BadRequest("You have reached your website creation limit");
    }
    // 🔹 3. نعمل Website جديد بالـ start_date = now و end_date = subscription.endDate
    const newWebsite = await websites_1.WebsiteModel.create({
        userId: req.user.id,
        templateId,
        activitiesId,
        demo_link,
        project_path,
        start_date: new Date(),
        end_date: subscription.endDate,
        status: "pending_admin_review",
    });
    // 🔹 4. نحدّث الـ subscription
    subscription.websites_created_count += 1;
    subscription.websites_remaining_count -= 1;
    await subscription.save();
    (0, response_1.SuccessResponse)(res, {
        message: "Website created successfully",
        newWebsite,
        subscriptionStatus: {
            websites_created_count: subscription.websites_created_count,
            websites_remaining_count: subscription.websites_remaining_count,
        },
    });
};
exports.createWebsite = createWebsite;
const getAllWebsites = async (req, res) => {
    if (!req.user)
        throw new index_1.UnauthorizedError("User not authenticated");
    const userID = req.user.id;
    const data = await websites_1.WebsiteModel.find({ userID }).populate("userId");
    if (!data)
        throw new NotFound_1.NotFound("No website found");
    (0, response_1.SuccessResponse)(res, { message: "All website fetched successfully", data });
};
exports.getAllWebsites = getAllWebsites;
const getWebsiteById = async (req, res) => {
    if (!req.user)
        throw new index_1.UnauthorizedError("User not authenticated");
    const { id } = req.params;
    if (!id)
        throw new BadRequest_1.BadRequest("Please provide website id");
    const data = await websites_1.WebsiteModel.findById(id).populate("userId");
    if (!data)
        throw new NotFound_1.NotFound("Website not found");
    (0, response_1.SuccessResponse)(res, { message: "Website fetched successfully", data });
};
exports.getWebsiteById = getWebsiteById;
