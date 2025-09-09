import joi from "joi";

export const createTemplateSchema = joi.object({
    name: joi.string().min(3).max(100).required(),
    activityId: joi.string().required(),
    isActive: joi.boolean().default(true),
    photo: joi.string().optional(),
    file_template_path: joi.string().optional(),

});
export const updateTemplateSchema = joi.object({
    name: joi.string().min(3).max(100),
    isActive: joi.boolean(),
}).min(1);