import { SubscriptionModel } from "../../models/shema/subscriptions";
import { WebsiteModel } from "../../models/shema/websites";
import { UnauthorizedError } from "../../Errors/index";
import { BadRequest } from "../../Errors/BadRequest";
import { NotFound } from "../../Errors/NotFound";
import { SuccessResponse } from "../../utils/response";
import { Request, Response } from "express";
export const getAllWebsites = async (req: Request, res: Response) => {
  if (!req.user || req.user.role !== "admin")
    throw new UnauthorizedError("Access denied");

  const websites = await WebsiteModel.find()
    .populate("userId", "name email")
    .populate("templateId", "name")
    .populate("activitiesId", "name");

  SuccessResponse(res, { message: "All websites fetched successfully", websites });
};


// ✅ 2- Get website by ID
export const getWebsiteById = async (req: Request, res: Response) => {
  if (!req.user || req.user.role !== "admin")
    throw new UnauthorizedError("Access denied");

  const { id } = req.params;
  if (!id) throw new BadRequest("Website ID is required");

  const website = await WebsiteModel.findById(id)
    .populate("userId", "name email")
    .populate("templateId", "name")
    .populate("activitiesId", "name");

  if (!website) throw new NotFound("Website not found");

  SuccessResponse(res, { message: "Website fetched successfully", website });
};


// ✅ 3- Approve/Reject website
export const updateWebsiteStatus = async (req: Request, res: Response) => {
  if (!req.user || req.user.role !== "admin")
    throw new UnauthorizedError("Access denied");

  const { id } = req.params;
  const { status, rejected_reason } = req.body;

  if (!id) throw new BadRequest("Website ID is required");
  if (!["approved", "rejected"].includes(status))
    throw new BadRequest("Status must be 'approved' or 'rejected'");

  const website = await WebsiteModel.findById(id);
  if (!website) throw new NotFound("Website not found");

  website.status = status;
  if (status === "rejected") {
    website.rejected_reason = rejected_reason || "Not specified";
  }

  await website.save();

  SuccessResponse(res, { message: "Website status updated successfully", website });
};
