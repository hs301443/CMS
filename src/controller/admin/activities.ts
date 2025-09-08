import { Request, Response } from "express";
import { ActivityModel } from "../../models/shema/activities";
import { BadRequest } from "../../Errors/BadRequest";
import { NotFound } from "../../Errors";
import { SuccessResponse } from "../../utils/response";
import { UnauthorizedError } from "../../Errors";

export const createActivity = async (req: Request, res: Response) => {
    if (!req.user || req.user.role !== 'admin')  throw new UnauthorizedError("Access denied");

    const { name, isActive } = req.body;

    const existingActivity = await ActivityModel.findOne({ name });
    if (existingActivity)  throw new BadRequest("Activity with this name already exists");
    
    const activity = new ActivityModel({ name, isActive });
    await activity.save();
    SuccessResponse(res, { message: "Activity created successfully", activity });
}
export const getAllActivities = async (req: Request, res: Response) => {
    if (!req.user || req.user.role !== 'admin')  throw new UnauthorizedError("Access denied");
    const activities = await ActivityModel.find().populate("templates");
    SuccessResponse(res, { message: "All activities fetched successfully", activities });
}
export const getActivityById = async (req: Request, res: Response) => {
    if (!req.user || req.user.role !== 'admin')  throw new UnauthorizedError("Access denied");
    const { id } = req.params;
    if (!id)  throw new BadRequest("Please provide activity id");
    const activity = await ActivityModel.findById(id).populate("templates");
    if (!activity)  throw new NotFound("Activity not found");
      
    SuccessResponse(res, { message: "Activity fetched successfully", activity });
}
export const updateActivity = async (req: Request, res: Response) => {
    if (!req.user || req.user.role !== 'admin')  throw new UnauthorizedError("Access denied");
    const { id } = req.params;
    if (!id)  throw new BadRequest("Please provide activity id");
    const { name, isActive } = req.body;
    const activity = await ActivityModel.findByIdAndUpdate(id, { name, isActive }, { new: true });  
    if (!activity)  throw new NotFound("Activity not found");
    SuccessResponse(res, { message: "Activity updated successfully", activity });
}
export const deleteActivity = async (req: Request, res: Response) => {
    if (!req.user || req.user.role !== 'admin')  throw new UnauthorizedError("Access denied");
    const { id } = req.params;
    if (!id)  throw new BadRequest("Please provide activity id");
    const activity = await ActivityModel.findByIdAndDelete(id);
    if (!activity)  throw new NotFound("Activity not found");
    SuccessResponse(res, { message: "Activity deleted successfully" });
}
