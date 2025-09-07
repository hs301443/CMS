import joi from "joi";

export const createActivitySchema = joi.object({
    name: joi.string().min(3).max(100).required(),
    isActive: joi.boolean().default(true),
});
export const updateActivitySchema = joi.object({
    name: joi.string().min(3).max(100),
    isActive: joi.boolean(),
}).min(1);