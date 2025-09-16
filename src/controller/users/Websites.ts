import { SubscriptionModel } from "../../models/shema/subscriptions";
import { WebsiteModel } from "../../models/shema/websites";
import { UnauthorizedError } from "../../Errors/index";
import { BadRequest } from "../../Errors/BadRequest";
import { NotFound } from "../../Errors/NotFound";
import { SuccessResponse } from "../../utils/response";
import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { TemplateModel } from "../../models/shema/templates";
import mongoose from "mongoose";

export const createWebsite = async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError("User not authenticated");

  const { templateId, activitiesId, demo_link } = req.body;
  if (!templateId || !demo_link || !activitiesId) {
    throw new BadRequest("Please provide all required fields");
  }

  // ✅ تأكد من وجود التيمبلت
  const template = await TemplateModel.findById(templateId);
  if (!template) throw new BadRequest("Template not found");

  // ✅ هات الاشتراك الـ active بس
  const subscription = await SubscriptionModel.findOne({
    userId: req.user.id,
    status: "active",
    endDate: { $gte: new Date() },
  }).sort({ createdAt: -1 });

  if (!subscription) {
    throw new BadRequest("You do not have an active subscription");
  }

  // ✅ شيك على عدد المواقع المتاحة
  if (subscription.websites_remaining_count <= 0) {
    throw new BadRequest("You have reached your website creation limit");
  }

  // ✅ اعمل نسخة من التيمبلت
  const websiteId = new Date().getTime();
  const websitesDir = path.join(__dirname, "../../uploads/websites", String(websiteId));
  if (!fs.existsSync(websitesDir)) {
    fs.mkdirSync(websitesDir, { recursive: true });
  }

  // ✨ هات اسم الملف من اللينك
  const templateFileName = path.basename(template.template_file_path); // ex: file.zip
  const templateSourcePath = path.join(__dirname, "../../uploads/templates", templateFileName);
  const copiedTemplatePath = path.join(websitesDir, templateFileName);

  // ✨ انسخ الملف
  fs.copyFileSync(templateSourcePath, copiedTemplatePath);

  // ✨ ابني اللينك الجديد للمشروع
  const projectLink = `${req.protocol}://${req.get("host")}/uploads/websites/${websiteId}/${templateFileName}`;

  // ✅ أنشئ الويبسايت الجديد
  const newWebsite = await WebsiteModel.create({
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

export const updateWebsite = async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError("User not authenticated");

  const { websiteId } = req.params;
  const { demo_link, status, rejected_reason } = req.body;

  // ✅ تحقق من الـ ID
  if (!mongoose.Types.ObjectId.isValid(websiteId)) {
    throw new BadRequest("Invalid website ID format");
  }

  // ✅ هات الويبسايت الخاص باليوزر
  const website = await WebsiteModel.findOne({
    _id: websiteId,
    userId: req.user.id,
  });

  if (!website) {
    throw new NotFound("Website not found or you do not own it");
  }

  // ✅ تحديث الحقول الأساسية
  if (demo_link) website.demo_link = demo_link;
  if (status) website.status = status;
  if (rejected_reason) website.rejected_reason = rejected_reason;

  // ✅ لو جالك ملف جديد (project zip مثلًا)
  if (req.file) {
    const websiteFolder = path.join(
      __dirname,
      "../../uploads/websites",
      String(website._id)
    );

    if (!fs.existsSync(websiteFolder)) {
      fs.mkdirSync(websiteFolder, { recursive: true });
    }

    // ✨ خزن الملف الجديد جوه فولدر الويبسايت
    const fileName = Date.now() + path.extname(req.file.originalname);
    const newPath = path.join(websiteFolder, fileName);

    fs.writeFileSync(newPath, req.file.buffer);

    // ✨ اعمل لينك عام جديد
    const projectLink = `${req.protocol}://${req.get("host")}/uploads/websites/${website._id}/${fileName}`;

    // ✨ حدث الـ project_path
    website.project_path = projectLink;
  }

  await website.save();

  SuccessResponse(res, {
    message: "Website updated successfully",
    website,
  });
};


export const deleteWebsite = async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError("User not authenticated");

  const { websiteId } = req.params;

const website = await WebsiteModel.findOne({
  _id: new mongoose.Types.ObjectId(websiteId),
  userId: new mongoose.Types.ObjectId(req.user.id),
});  if (!website) {
    throw new BadRequest("Website not found or you do not own it");
  }

  if (fs.existsSync(website.project_path)) {
    try {
      fs.rmSync(website.project_path, { recursive: true, force: true }); 
    } catch (err) {
      console.error("Error deleting website files:", err);
    }
  }

  await WebsiteModel.deleteOne({ _id: website._id });

  const subscription = await SubscriptionModel.findOne({ userId: req.user.id })
    .sort({ createdAt: -1 });

  if (subscription) {
    subscription.websites_created_count -= 1;
    subscription.websites_remaining_count += 1;
    await subscription.save();
  }

  SuccessResponse(res, {
    message: "Website deleted successfully, limit restored",
    subscriptionStatus: {
      websites_created_count: subscription?.websites_created_count,
      websites_remaining_count: subscription?.websites_remaining_count,
    },
  });
};
