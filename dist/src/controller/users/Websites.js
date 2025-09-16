"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteWebsite = exports.updateWebsite = exports.getWebsiteById = exports.getAllWebsites = exports.createWebsite = void 0;
const subscriptions_1 = require("../../models/shema/subscriptions");
const websites_1 = require("../../models/shema/websites");
const index_1 = require("../../Errors/index");
const BadRequest_1 = require("../../Errors/BadRequest");
const NotFound_1 = require("../../Errors/NotFound");
const response_1 = require("../../utils/response");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const templates_1 = require("../../models/shema/templates");
const mongoose_1 = __importDefault(require("mongoose"));
const createWebsite = async (req, res) => {
    if (!req.user)
        throw new index_1.UnauthorizedError("User not authenticated");
    const { templateId, activitiesId, demo_link } = req.body;
    if (!templateId || !demo_link || !activitiesId) {
        throw new BadRequest_1.BadRequest("Please provide all required fields");
    }
    // ✅ تأكد من وجود التيمبلت
    const template = await templates_1.TemplateModel.findById(templateId);
    if (!template)
        throw new BadRequest_1.BadRequest("Template not found");
    // ✅ هات الاشتراك الـ active بس
    const subscription = await subscriptions_1.SubscriptionModel.findOne({
        userId: req.user.id,
        status: "active",
        endDate: { $gte: new Date() },
    }).sort({ createdAt: -1 });
    if (!subscription) {
        throw new BadRequest_1.BadRequest("You do not have an active subscription");
    }
    // ✅ شيك على عدد المواقع المتاحة
    if (subscription.websites_remaining_count <= 0) {
        throw new BadRequest_1.BadRequest("You have reached your website creation limit");
    }
    // ✅ اعمل نسخة من التيمبلت
    const websiteId = new Date().getTime();
    const websitesDir = path_1.default.join(__dirname, "../../uploads/websites", String(websiteId));
    if (!fs_1.default.existsSync(websitesDir)) {
        fs_1.default.mkdirSync(websitesDir, { recursive: true });
    }
    // ✨ هات اسم الملف من اللينك
    const templateFileName = path_1.default.basename(template.template_file_path); // ex: file.zip
    const templateSourcePath = path_1.default.join(__dirname, "../../uploads/templates", templateFileName);
    const copiedTemplatePath = path_1.default.join(websitesDir, templateFileName);
    // ✨ انسخ الملف
    fs_1.default.copyFileSync(templateSourcePath, copiedTemplatePath);
    // ✨ ابني اللينك الجديد للمشروع
    const projectLink = `${req.protocol}://${req.get("host")}/uploads/websites/${websiteId}/${templateFileName}`;
    // ✅ أنشئ الويبسايت الجديد
    const newWebsite = await websites_1.WebsiteModel.create({
        userId: req.user.id,
        templateId,
        activitiesId,
        demo_link,
        project_path: projectLink, // هنا اللينك مش المسار الداخلي
        start_date: new Date(),
        end_date: subscription.endDate,
        status: "pending_admin_review",
    });
    // ✅ عدّل الاشتراك
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
    const userId = req.user.id;
    const data = await websites_1.WebsiteModel.find({ userId });
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
    const data = await websites_1.WebsiteModel.findById(id).populate("userId", "name email");
    if (!data)
        throw new NotFound_1.NotFound("Website not found");
    (0, response_1.SuccessResponse)(res, { message: "Website fetched successfully", data });
};
exports.getWebsiteById = getWebsiteById;
const updateWebsite = async (req, res) => {
    if (!req.user)
        throw new index_1.UnauthorizedError("User not authenticated");
    const { websiteId } = req.params;
    const { demo_link, status, rejected_reason } = req.body;
    // ✅ تحقق من الـ ID
    if (!mongoose_1.default.Types.ObjectId.isValid(websiteId)) {
        throw new BadRequest_1.BadRequest("Invalid website ID format");
    }
    // ✅ هات الويبسايت الخاص باليوزر
    const website = await websites_1.WebsiteModel.findOne({
        _id: websiteId,
        userId: req.user.id,
    });
    if (!website) {
        throw new NotFound_1.NotFound("Website not found or you do not own it");
    }
    // ✅ تحديث الحقول الأساسية
    if (demo_link)
        website.demo_link = demo_link;
    if (status)
        website.status = status;
    if (rejected_reason)
        website.rejected_reason = rejected_reason;
    // ✅ لو جالك ملف جديد (project zip مثلًا)
    if (req.file) {
        const websiteFolder = path_1.default.join(__dirname, "../../uploads/websites", String(website._id));
        if (!fs_1.default.existsSync(websiteFolder)) {
            fs_1.default.mkdirSync(websiteFolder, { recursive: true });
        }
        // ✨ خزن الملف الجديد جوه فولدر الويبسايت
        const fileName = Date.now() + path_1.default.extname(req.file.originalname);
        const newPath = path_1.default.join(websiteFolder, fileName);
        fs_1.default.writeFileSync(newPath, req.file.buffer);
        // ✨ اعمل لينك عام جديد
        const projectLink = `${req.protocol}://${req.get("host")}/uploads/websites/${website._id}/${fileName}`;
        // ✨ حدث الـ project_path
        website.project_path = projectLink;
    }
    await website.save();
    (0, response_1.SuccessResponse)(res, {
        message: "Website updated successfully",
        website,
    });
};
exports.updateWebsite = updateWebsite;
const deleteWebsite = async (req, res) => {
    if (!req.user)
        throw new index_1.UnauthorizedError("User not authenticated");
    const { websiteId } = req.params;
    const website = await websites_1.WebsiteModel.findOne({
        _id: new mongoose_1.default.Types.ObjectId(websiteId),
        userId: new mongoose_1.default.Types.ObjectId(req.user.id),
    });
    if (!website) {
        throw new BadRequest_1.BadRequest("Website not found or you do not own it");
    }
    if (fs_1.default.existsSync(website.project_path)) {
        try {
            fs_1.default.rmSync(website.project_path, { recursive: true, force: true });
        }
        catch (err) {
            console.error("Error deleting website files:", err);
        }
    }
    await websites_1.WebsiteModel.deleteOne({ _id: website._id });
    const subscription = await subscriptions_1.SubscriptionModel.findOne({ userId: req.user.id })
        .sort({ createdAt: -1 });
    if (subscription) {
        subscription.websites_created_count -= 1;
        subscription.websites_remaining_count += 1;
        await subscription.save();
    }
    (0, response_1.SuccessResponse)(res, {
        message: "Website deleted successfully, limit restored",
        subscriptionStatus: {
            websites_created_count: subscription?.websites_created_count,
            websites_remaining_count: subscription?.websites_remaining_count,
        },
    });
};
exports.deleteWebsite = deleteWebsite;
