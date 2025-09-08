import { Request, Response } from 'express';
import {TemplateModel } from '../../models/shema/templates';
import { BadRequest } from '../../Errors/BadRequest';
import { NotFound } from '../../Errors/NotFound';
import { UnauthorizedError } from '../../Errors/unauthorizedError';
import { SuccessResponse } from '../../utils/response';

export const createTemplate = async (req: Request, res: Response) => {
  if (!req.user || req.user.role !== "admin")
    throw new UnauthorizedError("Access denied");

  const { name } = req.body;

  if (!name) throw new BadRequest("name is required");
  const file = req.file;
  if (!file) throw new BadRequest("file is required");

  const newTemplate = await TemplateModel.create({
    name,
    template_file_path: file.path, 
    });

  SuccessResponse(res, {
    message: "template created successfully",
    newTemplate,
  });
};



export const getAllTemplates =async (req: Request, res: Response) => {
     if (!req.user || req.user.role !== 'admin')  throw new UnauthorizedError("Access denied");
    const template = await TemplateModel.find();
    if(!template) throw new NotFound("Template not found")

SuccessResponse(res,{message:"get template successfully",template})

  }

export const updateTemplate = async (req: Request, res: Response) => {
  if (!req.user || req.user.role !== "admin") {
    throw new UnauthorizedError("Access denied");
  }

  const { id } = req.params;
  const { name } = req.body;
  const file = req.file; // لو عايز تعدل الملف

  if (!id) throw new BadRequest("Template ID is required");

  // بناء update object
  const updateData: any = {};
  if (name) updateData.name = name;
  if (file) updateData.template_file_path = file.path;

  const template = await TemplateModel.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true } // يرجع التيمبلت بعد التحديث
  );

  if (!template) throw new NotFound("Template not found");

  SuccessResponse(res, { message: "Template updated successfully", template });
};

export const getTemplateById = async (req: Request, res: Response) => {
  if (!req.user || req.user.role !== "admin") throw new UnauthorizedError("Access denied");

  const { id } = req.params;
  if (!id) throw new BadRequest("ID is required");

  const template = await TemplateModel.findById(id);
  if (!template) throw new NotFound("Template not found");

  SuccessResponse(res, { message: "get template successfully", template });
};

export const deleteTemplate = async (req: Request, res: Response) => {
  if (!req.user || req.user.role !== "admin") throw new UnauthorizedError("Access denied");

  const { id } = req.params;
  if (!id) throw new BadRequest("ID is required");

  const template = await TemplateModel.findByIdAndDelete(id);
  if (!template) throw new NotFound("Template not found");

  SuccessResponse(res, { message: "template deleted successfully" });
};



