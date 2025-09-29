
import Joi from "joi";

export const registerSchema = Joi.object({
  first_name: Joi.string().min(2).max(30).required().messages({
    "string.empty": "First name is required",
    "string.min": "First name must be at least 2 characters",
    "string.max": "First name must not exceed 30 characters",
    "any.required": "First name is required",
  }),

  last_name: Joi.string().min(2).max(30).required().messages({
    "string.empty": "Last name is required",
    "string.min": "Last name must be at least 2 characters",
    "string.max": "Last name must not exceed 30 characters",
    "any.required": "Last name is required",
  }),

  phone: Joi.string()
    .pattern(/^\+?\d{9,15}$/)
    .required()
    .messages({
      "string.empty": "Phone number is required",
      "string.pattern.base": "Phone number must be valid ( +998901234567)",
      "any.required": "Phone number is required",
    }),

  email: Joi.string()
    .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.pattern.base": "Email must be a valid email address",
      "any.required": "Email is required",
    }),

  password: Joi.string()
    .pattern(/^[A-Za-z#$%]{6,12}$/)
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.pattern.base":
        "Password must be 6–12 characters, only letters (A–Z, a–z) and symbols # $ %",
      "any.required": "Password is required",
    }),
});

export const updateSchema = Joi.object({
  first_name: Joi.string().min(2).max(30).messages({
    "string.min": "First name must be at least 2 characters",
    "string.max": "First name must not exceed 30 characters",
  }),

  last_name: Joi.string().min(2).max(30).messages({
    "string.min": "Last name must be at least 2 characters",
    "string.max": "Last name must not exceed 30 characters",
  }),

  phone: Joi.string()
    .pattern(/^\+?\d{9,15}$/)
    .messages({
      "string.pattern.base": "Phone number must be valid ( +998901234567)",
    }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .messages({
      "string.email": "Email must be a valid email address",
    }),

  password: Joi.string()
    .pattern(/^[A-Za-z#$%]{6,12}$/)
    .messages({
      "string.pattern.base":
        "Password must be 6–12 characters, only letters (A–Z, a–z) and symbols # $ %",
    }),
}).min(1);


export const changePasswordSchema = Joi.object({
  email: Joi.string()
    .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.pattern.base": "Email must be a valid email address",
      "any.required": "Email is required",
    }),

  new_password: Joi.string().min(6).max(12).required().messages({
    "string.empty": "New password cannot be empty",
    "string.min": "New password must be at least 6 characters long",
    "string.max": "New password cannot be longer than 30 characters",
    "any.required": "New password is required",
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string()
    .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.pattern.base": "Email must be a valid email address",
      "any.required": "Email is required",
    }),

  password: Joi.string()
    .pattern(/^[A-Za-z#$%]{6,12}$/)
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.pattern.base":
        "Password must be 6–12 characters, only letters (A–Z, a–z) and symbols # $ %",
      "any.required": "Password is required",
    }),
});
