"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePlan = exports.updatePlan = exports.getPlanById = exports.getAllPlans = exports.createPlan = void 0;
const plans_1 = require("../../models/shema/plans");
const response_1 = require("../../utils/response");
const BadRequest_1 = require("../../Errors/BadRequest");
const NotFound_1 = require("../../Errors/NotFound");
const unauthorizedError_1 = require("../../Errors/unauthorizedError");
const createPlan = async (req, res) => {
    if (!req.user || req.user.role !== 'admin')
        throw new unauthorizedError_1.UnauthorizedError("Access denied");
    const { name, price_quarterly, price_semi_annually, price_annually, website_limit } = req.body;
    if (!name || !price_quarterly || !price_semi_annually || !price_annually || !website_limit)
        throw new BadRequest_1.BadRequest('Please provide all the required fields');
    const plan = await plans_1.PlanModel.create({ name, price_quarterly, price_semi_annually, price_annually, website_limit });
    (0, response_1.SuccessResponse)(res, { message: 'Plan created successfully', plan });
};
exports.createPlan = createPlan;
const getAllPlans = async (req, res) => {
    if (!req.user || req.user.role !== 'admin')
        throw new unauthorizedError_1.UnauthorizedError("Access denied");
    const plans = await plans_1.PlanModel.find();
    (0, response_1.SuccessResponse)(res, { message: 'All plans fetched successfully', plans });
};
exports.getAllPlans = getAllPlans;
const getPlanById = async (req, res) => {
    if (!req.user || req.user.role !== 'admin')
        throw new unauthorizedError_1.UnauthorizedError("Access denied");
    const { id } = req.params;
    if (!id)
        throw new BadRequest_1.BadRequest('Please provide plan id');
    const plan = await plans_1.PlanModel.findById(id);
    if (!plan)
        throw new NotFound_1.NotFound('Plan not found');
    (0, response_1.SuccessResponse)(res, { message: 'Plan fetched successfully', plan });
};
exports.getPlanById = getPlanById;
const updatePlan = async (req, res) => {
    if (!req.user || req.user.role !== 'admin')
        throw new unauthorizedError_1.UnauthorizedError("Access denied");
    const { id } = req.params;
    if (!id)
        throw new BadRequest_1.BadRequest('Please provide plan id');
    const { name, price_quarterly, price_semi_annually, price_annually, website_limit } = req.body;
    const plan = await plans_1.PlanModel.findByIdAndUpdate(id, { name, price_quarterly, price_semi_annually, price_annually, website_limit }, { new: true });
    if (!plan)
        throw new NotFound_1.NotFound('Plan not found');
    (0, response_1.SuccessResponse)(res, { message: 'Plan updated successfully', plan });
};
exports.updatePlan = updatePlan;
const deletePlan = async (req, res) => {
    if (!req.user || req.user.role !== 'admin')
        throw new unauthorizedError_1.UnauthorizedError("Access denied");
    const { id } = req.params;
    if (!id)
        throw new BadRequest_1.BadRequest('Please provide plan id');
    const plan = await plans_1.PlanModel.findByIdAndDelete(id);
    if (!plan)
        throw new NotFound_1.NotFound('Plan not found');
    (0, response_1.SuccessResponse)(res, { message: 'Plan deleted successfully' });
};
exports.deletePlan = deletePlan;
