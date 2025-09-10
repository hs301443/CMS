"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlanById = exports.getAllPlans = void 0;
const plans_1 = require("../../models/shema/plans");
const response_1 = require("../../utils/response");
const BadRequest_1 = require("../../Errors/BadRequest");
const NotFound_1 = require("../../Errors/NotFound");
const getAllPlans = async (req, res) => {
    const plans = await plans_1.PlanModel.find();
    (0, response_1.SuccessResponse)(res, { message: 'All plans fetched successfully', plans });
};
exports.getAllPlans = getAllPlans;
const getPlanById = async (req, res) => {
    const { id } = req.params;
    if (!id)
        throw new BadRequest_1.BadRequest('Please provide plan id');
    const plan = await plans_1.PlanModel.findById(id);
    if (!plan)
        throw new NotFound_1.NotFound('Plan not found');
    (0, response_1.SuccessResponse)(res, { message: 'Plan fetched successfully', plan });
};
exports.getPlanById = getPlanById;
