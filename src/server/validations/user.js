import joi from 'joi';

export const UserSchema = joi.object({
  universityId: joi.string().guid({
    version: [
      'uuidv4'
    ]
  }).required(),
  name: joi.string().required(),
  email: joi.string().email({ tlds: { allow: false } }).required(),
  password: joi.string().required().min(8).max(12),
  confirmPassword: joi.string().valid(joi.ref('password')).required(),
  role: joi.string().valid('student', 'dean').required()
});

export const LoginSchema = joi.object({
  universityId: joi.string().guid({
    version: [
      'uuidv4'
    ]
  }).required(),
  password: joi.string().min(8).max(12).required(),
  role: joi.string().valid('student', 'dean').required()
});

export const BookSlotSchema = joi.object({
  name: joi.string().required(),
  bookedAt: joi.string().required()
});