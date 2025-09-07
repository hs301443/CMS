import { Request, Response } from "express";
import { ActivityModel } from "../../models/shema/activities";
import { BadRequest } from "../../Errors/BadRequest";
import { NotFound } from "../../Errors";
import { SuccessResponse } from "../../utils/response";
import { UnauthorizedError } from "../../Errors";

export const getAllActivities = async (req: Request, res: Response) => {
    if (!req.user) throw new UnauthorizedError("user is not authenticated");
    const activities = await ActivityModel.find({ isActive: true });
    SuccessResponse(res, { message: "All activities fetched successfully", activities });
}

export const getActivityById = async (req: Request, res: Response) => {
    if (!req.user) throw new UnauthorizedError("user is not authenticated");
    const { id } = req.params;
    if (!id) throw new BadRequest("Please provide activity id");
    const activity = await ActivityModel.findById(id);
    if (!activity) throw new NotFound("Activity not found");
    SuccessResponse(res, { message: "Activity fetched successfully", activity });
}