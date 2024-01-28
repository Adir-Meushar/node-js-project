const Joi = require('joi');

const cardValidationSchema = Joi.object({
    title: Joi.string().min(2).max(30).required().messages({
      'string.min': 'Title must be at least {#limit} characters long',
      'string.max': 'Title must not exceed {#limit} characters',
      'any.required': 'Title is required',
    }),
    subtitle: Joi.string().min(2).max(30).required().messages({
      'string.min': 'Subtitle must be at least {#limit} characters long',
      'string.max': 'Subtitle must not exceed {#limit} characters',
      'string.empty': 'Subtitle must not be empty',
    }),
    description: Joi.string().min(2).max(150).required().messages({
      'string.min': 'Description must be at least {#limit} characters long',
      'string.max': 'Description must not exceed {#limit} characters',
      'any.required': 'Description is required',
    }),
  phone: Joi.string().pattern(/^[0-9]{9,13}$/).required().messages({
    'string.pattern.base': 'Phone number must be numeric and between 9 to 13 digits',
    'any.required': 'Phone number is required',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Invalid email format',
    'any.required': 'Email is required',
  }),
  web: Joi.string().min(2).required().messages({
    'string.min': 'Website must be at least {#limit} characters long',
    'any.required': 'Website is required',
  }),
  address: Joi.object({
    state: Joi.string().min(2).max(100).allow(''),
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
  bizNumber: Joi.number().integer(),
});

module.exports = cardValidationSchema;
