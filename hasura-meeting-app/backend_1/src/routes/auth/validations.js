import Joi from "@hapi/joi";

export const registerSchema = Joi.object({
    name: Joi.string().min(1).max(60).required(),
    surname: Joi.string().min(1).max(60).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(60).required()
});