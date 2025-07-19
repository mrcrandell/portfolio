import Joi from "joi";
export const useContactValidation = () => {
  const contactSchema = Joi.object().keys({
    name: Joi.string().trim().required().messages({
      "string.empty": "Please enter your name.",
      "any.required": "Please enter your name.",
    }),
    email: Joi.string()
      .trim()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        "string.email": `Please enter a valid email.`,
        "string.empty": "Please enter your email.",
        "any.required": "Please enter your email.",
      }),
    messageText: Joi.string()
      .trim()
      .required()
      .regex(/\w+(?:\s+\w+)+/)
      .messages({
        "string.pattern.base": `Please enter more than one word.`,
        "string.empty": "Please enter a message.",
        "any.required": "Please enter a message.",
      }),
    token: Joi.string().trim().required(),
  });
  return contactSchema;
};
