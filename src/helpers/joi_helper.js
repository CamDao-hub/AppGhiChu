const Joi = require('joi');
// Schema validation cho việc tạo user
const createUserSchema = Joi.object({
  name: Joi.string()
    .required()
    .trim()
    .min(2)
    .max(100)
    .messages({
      'string.empty': 'Tên không được để trống',
      'string.min': 'Tên phải có ít nhất {#limit} ký tự',
      'string.max': 'Tên không được vượt quá {#limit} ký tự',
      'any.required': 'Tên là bắt buộc',
    }),
  email: Joi.string()
    .required()
    .email()
    .trim()
    .lowercase()
    .messages({
      'string.empty': 'Email không được để trống',
      'string.email': 'Email không hợp lệ',
      'any.required': 'Email là bắt buộc',
    }),
  password: Joi.string()
    .required()
    .min(6)
    .max(50)
    .messages({
      'string.empty': 'Password không được để trống',
      'string.min': 'Password phải có ít nhất {#limit} ký tự',
      'string.max': 'Password không được vượt quá {#limit} ký tự',
      'any.required': 'Password là bắt buộc',
    }),
  address: Joi.object({
    street: Joi.string().trim().allow(''),
    city: Joi.string().trim().allow(''),
    country: Joi.string().trim().allow(''),
  }).optional(),
  languages: Joi.array()
    .items(Joi.string())
    .optional(),
  bio: Joi.string()
    .optional()
    .allow(''),
});

// Schema validation cho việc update user
const updateUserSchema = Joi.object({
  name: Joi.string()
    .optional()
    .trim()
    .min(2)
    .max(100)
    .messages({
      'string.min': 'Tên phải có ít nhất {#limit} ký tự',
      'string.max': 'Tên không được vượt quá {#limit} ký tự',
    }),
  email: Joi.string()
    .optional()
    .email()
    .trim()
    .lowercase()
    .messages({
      'string.email': 'Email không hợp lệ',
    }),
  password: Joi.string()
    .optional()
    .min(6)
    .max(50)
    .messages({
      'string.min': 'Password phải có ít nhất {#limit} ký tự',
      'string.max': 'Password không được vượt quá {#limit} ký tự',
    }),
  address: Joi.object({
    street: Joi.string().trim().allow(''),
    city: Joi.string().trim().allow(''),
    country: Joi.string().trim().allow(''),
  }).optional(),
  languages: Joi.array()
    .items(Joi.string())
    .optional(),
  bio: Joi.string()
    .optional()
    .allow(''),
});

// Hàm validate dữ liệu
const validateCreateUser = (data) => {
  return createUserSchema.validate(data, { abortEarly: false });
};
const loginSchema = Joi.object({
  email: Joi.string()
    .required()
    .email()
    .messages({
      'string.empty': 'Email không được để trống',
      'string.email': 'Email không hợp lệ',
      'any.required': 'Email là bắt buộc',
    }),

  password: Joi.string()
    .required()
    .messages({
      'string.empty': 'Mật khẩu không được để trống',
      'any.required': 'Mật khẩu là bắt buộc',
    }),
});
const validateUpdateUser = (data) => {
  return updateUserSchema.validate(data, { abortEarly: false });
};

module.exports = {
  createUserSchema,
  updateUserSchema,
  validateCreateUser,
  validateUpdateUser,
  loginSchema,
};
