"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTemplate = exports.getTemplateById = exports.updateTemplate = exports.getAllTemplates = exports.createTemplate = void 0;
const templates_1 = require("../../models/shema/templates");
const BadRequest_1 = require("../../Errors/BadRequest");
const NotFound_1 = require("../../Errors/NotFound");
const unauthorizedError_1 = require("../../Errors/unauthorizedError");
const response_1 = require("../../utils/response");
const createTemplate = async (req, res) => {
    if (!req.user || req.user.role !== "admin")
        throw new unauthorizedError_1.UnauthorizedError("Access denied");
    const { name, activityId } = req.body;
    if (!name)
        throw new BadRequest_1.BadRequest("name is required");
    const file = req.file;
    if (!file)
        throw new BadRequest_1.BadRequest("file is required");
    const newTemplate = await templates_1.TemplateModel.create({
        name,
        template_file_path: file.path,
        activityId
    });
    (0, response_1.SuccessResponse)(res, {
        message: "template created successfully",
        newTemplate,
    });
};
exports.createTemplate = createTemplate;
const getAllTemplates = async (req, res) => {
    if (!req.user || req.user.role !== 'admin')
        throw new unauthorizedError_1.UnauthorizedError("Access denied");
    const template = await templates_1.TemplateModel.find().populate('activityId', 'name isActive');
    if (!template)
        throw new NotFound_1.NotFound("Template not found");
    (0, response_1.SuccessResponse)(res, { message: "get template successfully", template });
};
exports.getAllTemplates = getAllTemplates;
const updateTemplate = async (req, res) => {
    if (!req.user || req.user.role !== "admin") {
        throw new unauthorizedError_1.UnauthorizedError("Access denied");
    }
    const { id } = req.params;
    const { name, activityId } = req.body;
    const file = req.file; // لو عايز تعدل الملف
    if (!id)
        throw new BadRequest_1.BadRequest("Template ID is required");
    // بناء update object
    const updateData = {};
    if (name)
        updateData.name = name;
    if (file)
        updateData.template_file_path = file.path;
    if (activityId)
        updateData.activityId = activityId;
    const template = await templates_1.TemplateModel.findByIdAndUpdate(id, { $set: updateData }, { new: true } // يرجع التيمبلت بعد التحديث
    );
    if (!template)
        throw new NotFound_1.NotFound("Template not found");
    (0, response_1.SuccessResponse)(res, { message: "Template updated successfully", template });
};
exports.updateTemplate = updateTemplate;
const getTemplateById = async (req, res) => {
    if (!req.user || req.user.role !== "admin")
        throw new unauthorizedError_1.UnauthorizedError("Access denied");
    const { id } = req.params;
    if (!id)
        throw new BadRequest_1.BadRequest("ID is required");
    const template = await templates_1.TemplateModel.findById(id).populate('activityId', 'name isActive');
    if (!template)
        throw new NotFound_1.NotFound("Template not found");
    (0, response_1.SuccessResponse)(res, { message: "get template successfully", template });
};
exports.getTemplateById = getTemplateById;
const deleteTemplate = async (req, res) => {
    if (!req.user || req.user.role !== "admin")
        throw new unauthorizedError_1.UnauthorizedError("Access denied");
    const { id } = req.params;
    if (!id)
        throw new BadRequest_1.BadRequest("ID is required");
    const template = await templates_1.TemplateModel.findByIdAndDelete(id);
    if (!template)
        throw new NotFound_1.NotFound("Template not found");
    (0, response_1.SuccessResponse)(res, { message: "template deleted successfully" });
};
exports.deleteTemplate = deleteTemplate;
