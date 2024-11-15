import Joi from "joi";

const userSchemaValidation = Joi.object({
  username: Joi.string()
    .min(3)
    .max(25)
    .pattern(/^[A-Za-z0-9]+$/)
    .message("The username is required and can only contain letters, numbers")
    .trim()
    .required(),

  email: Joi.string().email().message("Email type is not correct").required(),

  password: Joi.string()
    .pattern(/^[A-Za-z0-9@]+$/)
    .trim()
    .required()
    .min(4)
    .max(12)
    .message(
      "Password must be between 4 and 12 characters and a special charater is allowed"
    ),
});

const loginSchemaValidation = Joi.object({
  email: Joi.string().email().message("Email type is not correct").required(),

  password: Joi.string()
    .pattern(/^[A-Za-z0-9@]+$/)
    .trim()
    .required()
    .min(4)
    .max(12)
    .message("Password is not in correct formate"),
});

const assignmentSchemaValidation = Joi.object({
  userId: Joi.string().required(),
  admin: Joi.string()
    .min(3)
    .max(25)
    .pattern(/^[A-Za-z0-9]+$/)
    .message("The admin name is required and can only contain letters, numbers")
    .trim()
    .required(),
  task: Joi.string()
    .min(3)
    .pattern(/^[A-Za-z0-9 ]+$/)
    .message("The task is required and can only contain letters, numbers")
    .required(),
});

export {
  userSchemaValidation,
  loginSchemaValidation,
  assignmentSchemaValidation,
};
