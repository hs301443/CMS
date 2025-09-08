import joi from "joi";

export const createTemplateSchema = joi.object({
    name: joi.string().min(3).max(100).required(),
    isActive: joi.boolean().default(true),
});
export const updateTemplateSchema = joi.object({
    name: joi.string().min(3).max(100),
    isActive: joi.boolean(),
}).min(1);