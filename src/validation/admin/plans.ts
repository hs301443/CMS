import Joi from "joi";

export const CreateplanSchema = Joi.object({
  name: Joi.string().required(),
  price_monthly: Joi.number().optional(),
  price_quarterly: Joi.number().optional(),
  price_semi_annually: Joi.number().optional(),
  price_annually: Joi.number().optional(),
  website_limit: Joi.number().optional(),
});

export const UpdateplanSchema = Joi.object({
  name: Joi.string().optional(),
    price_monthly: Joi.number().optional(),
  price_quarterly: Joi.number().optional(),
  price_semi_annually: Joi.number().optional(),
  price_annually: Joi.number().optional(),
  website_limit: Joi.number().optional(),
});