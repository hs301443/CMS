import { SubscriptionModel } from "../../models/shema/subscriptions";
import { WebsiteModel } from "../../models/shema/websites";
import { UnauthorizedError } from "../../Errors/index";
import { BadRequest } from "../../Errors/BadRequest";
import { NotFound } from "../../Errors/NotFound";
import { SuccessResponse } from "../../utils/response";
import { Request, Response } from "express";

export const createWebsite = async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError("User not authenticated");

  const { templateId, activitiesId, demo_link, project_path } = req.body;

  if (!templateId || !demo_link || !project_path || !activitiesId) {
    throw new BadRequest("Please provide all required fields");
  }

  // 🔹 1. نجيب subscription الخاص باليوزر
  const subscription = await SubscriptionModel.findOne({ userId: req.user.id })
    .sort({ createdAt: -1 });

  if (!subscription) {
    throw new BadRequest("You do not have an active subscription");
  }

  // 🔹 2. نعمل تشيك على الـ remaining
  if (subscription.websites_remaining_count <= 0) {
    throw new BadRequest("You have reached your website creation limit");
  }

  // 🔹 3. نعمل Website جديد بالـ start_date = now و end_date = subscription.endDate
  const newWebsite = await WebsiteModel.create({
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

  SuccessResponse(res, {
    message: "Website created successfully",
    newWebsite,
    subscriptionStatus: {
      websites_created_count: subscription.websites_created_count,
      websites_remaining_count: subscription.websites_remaining_count,
    },
  });
};

export const getAllWebsites = async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError("User not authenticated");
  const userId =req.user.id;
  const data = await WebsiteModel.find({userId });
  if (!data) throw new NotFound("No website found");
  SuccessResponse(res, { message: "All website fetched successfully", data });
};

export const getWebsiteById = async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError("User not authenticated");
  const { id } = req.params;
  if (!id) throw new BadRequest("Please provide website id");
  const data = await WebsiteModel.findById(id).populate("userId", "name email");
  if (!data) throw new NotFound("Website not found");
  SuccessResponse(res, { message: "Website fetched successfully", data });
};
