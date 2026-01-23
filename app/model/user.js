const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Joi = require("joi");

const UserRegistrationValidationSchema = Joi.object({
  name: Joi.string().min(2).max(20).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 2 characters",
  }),

  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email",
    "string.empty": "Email is required",
  }),

  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone must be a valid 10 digit number",
      "string.empty": "Phone is required",
    }),

  password: Joi.string().min(4).max(30).required().messages({
    "string.min": "Password must be at least 4 characters",
    "string.empty": "Password is required",
  }),

  role: Joi.string().valid("admin", "user", "provider").optional(),
});

const UserLoginValidationSchema = Joi.object({
  email: Joi.string().email().lowercase().required().messages({
    "string.email": "Please enter a valid email address",
    "string.empty": "Email is required",
  }),

  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user", "provider"],
      default: "user",
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const UserModel = mongoose.model("user", UserSchema);
module.exports = {
  UserModel,
  UserRegistrationValidationSchema,
  UserLoginValidationSchema,
};
