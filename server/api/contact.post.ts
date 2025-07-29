import mustache from "mustache";
import juice from "juice";
import formData from "form-data";
import Mailgun from "mailgun.js";
import { useContactValidation } from "../../composables/useContactValidation.js";
const contactValidation = useContactValidation();

// import * as templateDir from '../../public/emails/contact.html';
// import templateDir from '../../public/emails/contact.html';

async function validateToken(ip: string, token: string, secret: string) {
  const formData = new FormData();
  formData.append("secret", secret);
  formData.append("response", token);
  formData.append("remoteip", ip);

  const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
  const result = await fetch(url, {
    body: formData,
    method: "POST",
  });

  const outcome = await result.json();
  return outcome.success;
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const body = await readBody(event);
  const mailgun = new Mailgun(formData as any);
  const client = mailgun.client({ username: "api", key: config.mailgunApi });
  const turnstileSecret = config.nuxtTurnstileSecretKey || "";

  /* const contactSchema = Joi.object().keys({
    name: Joi.string().trim().required().messages({
      "string.empty": "Please enter your name.",
      "any.required": "Please enter your name."
    }),
    email: Joi.string().trim().email().required().messages({
      "string.email": `Please enter a valid email.`,
      "string.empty": "Please enter your email.",
      "any.required": "Please enter your email."
    }),
    messageText: Joi.string().trim().required().regex(/^\w+\s+\w+$/).messages({
      "string.pattern.base": `Please enter more than one word.`,
      "string.empty": "Please enter a message.",
      "any.required": "Please enter a message."
    }),
    recaptchaToken: Joi.string().trim().required(),
  }); */
  const { error } = contactValidation.validate(body, { abortEarly: false });
  // console.log(error);
  if (error) {
    setResponseStatus(event, 403);
    return error?.details;
  }
  // console.log(value);

  // console.log(config.invisibleRecaptchaSecretkey);
  /* const recaptchaResponse: any = await $fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${config.invisibleRecaptchaSecretkey}&response=${body.recaptchaToken}`
  );
  console.log(recaptchaResponse)
  // Add if statement with if (recaptchaResponse.success)
  // console.log(process.cwd());
  if (!recaptchaResponse.success) {
    setResponseStatus(event, 403);
    return { errors: "Recaptcha failed" };
  } */
  // Validate Turnstile token
  const token = (body.token || body["cf-turnstile-response"] || "") as string;
  let ip = event.node.req.headers["cf-connecting-ip"] || "";
  if (Array.isArray(ip)) {
    ip = ip[0];
  }
  // console.log("ip", ip);
  // console.log("token", token);
  // console.log("secret", turnstileSecret);

  if (!(await validateToken(ip, token, turnstileSecret))) {
    // HTTP_400: Bad Request
    /* return {
      status: 400,
      body: {
        error: "Invalid token",
      },
    }; */
    setResponseStatus(event, 400);
    return { error: "Invalid token" };
  }
  // Prep email 1
  const emailData = {
    name: body.name,
    email: body.email,
    messageText: body.messageText,
    year: new Date().getFullYear(),
    emailBody: "",
  };
  // const filePath = join(process.cwd(), "server/assets/emails/contact.html");

  // Read the template synchronously
  // const template = readFileSync(filePath, "utf-8");
  const assets = useStorage("assets:server");
  const template = await assets.getItem("emails/contact.html");
  if (typeof template !== "string") {
    setResponseStatus(event, 500);
    return { error: "Email template not found." };
  }
  emailData.emailBody = `<div>
      <h1>You've Been Contacted by ${emailData.name}</h1>
      <p><strong>Name:</strong> ${emailData.name}</p>
      <p><strong>Email:</strong> <a href="mailto:${emailData.email}" target="_blank">${emailData.email}</a></p>
      <p>${emailData.name} writes... ${emailData.messageText}</p>
    </div>`;
  let html = juice(mustache.render(template, emailData));
  let data = {
    from: "postmaster@mailgun.mattcrandell.com",
    to: "me@mattcrandell.com",
    "h:Reply-To": emailData.email,
    subject: `You've Been Contacted from Your Website by ${emailData.name}`,
    html,
  };
  try {
    await client.messages.create(config.mailgunDomain, data);
    // Email 2
    emailData.emailBody = `<div>
        <h1>Thank You for Contacting Matt Crandell</h1>
        <p>I will get back to you as quickly as possible.</p>
      </div>`;
    html = juice(mustache.render(template, emailData));
    data = {
      from: "postmaster@mailgun.mattcrandell.com",
      to: body.email,
      "h:Reply-To": "me@mattcrandell.com",
      subject: "Thank You for Contacting Matt Crandell",
      html,
    };
    await client.messages.create(config.mailgunDomain, data);
    return {
      successMessage:
        "Thank you for contacting me, I will get back to you as soon as possible.",
    };
  } catch (error) {
    return error;
  }
});
