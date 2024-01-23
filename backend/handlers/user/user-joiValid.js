const Joi = require('joi');

const userValidationSchema = Joi.object({
  fullName: Joi.object({
    first: Joi.string().min(2).max(30).pattern(/^[^\d]+$/).required().messages({
      'string.min': 'First name must be at least {#limit} characters long',
      'string.max': 'First name must not exceed {#limit} characters',
      'string.pattern.base': 'First name cannot contain numeric characters',
      'any.required': 'First name is required',
    }),
    middle: Joi.string().allow(''),
    last: Joi.string().min(2).max(30).pattern(/^[^\d]+$/).required().messages({
      'string.min': 'Last name must be at least {#limit} characters long',
      'string.max': 'Last name must not exceed {#limit} characters',
      'string.pattern.base': 'Last name cannot contain numeric characters',
      'any.required': 'Last name is required',
    }),
  }),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/).required().messages({
    'string.pattern.base': 'Phone number must be numeric and between 10 to 15 digits',
    'any.required': 'Phone number is required',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Invalid email format',
    'any.required': 'Email is required',
  }),
  password: Joi.string().required().pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@%$#^&*\-_*]).{8,32}$/).messages({
    'string.pattern.base': 'Password must contain at least one digit, one lowercase and one uppercase letter, and one special character',
    'any.required': 'Password is required',
  }),
  address: Joi.object({
    state: Joi.string().allow(''),
    country: Joi.string().min(2).max(100).messages({
      'string.min': 'Country must be at least {#limit} characters long',
      'string.max': 'Country must not exceed {#limit} characters',
    }),
    city: Joi.string().min(2).max(100).messages({
      'string.min': 'City must be at least {#limit} characters long',
      'string.max': 'City must not exceed {#limit} characters',
    }),
    street: Joi.string().min(2).max(100).messages({
      'string.min': 'Street must be at least {#limit} characters long',
      'string.max': 'Street must not exceed {#limit} characters',
    }),
    houseNumber: Joi.number().positive(),
    zip: Joi.number().positive(),
  }),
  img: Joi.object({
    url: Joi.string(),
    alt: Joi.string(),
  }),
  isBusiness: Joi.boolean().default(false),
  isAdmin: Joi.boolean().default(false),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Invalid email format',
    'any.required': 'Email is required',
  }),
  password: Joi.string().required().pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@%$#^&*\-_*]).{8,32}$/).messages({
    'string.pattern.base': 'Password must contain at least one digit, one lowercase and one uppercase letter, and one special character',
    'any.required': 'Password is required',
  }),
});

module.exports = userValidationSchema;
module.exports = loginSchema;
