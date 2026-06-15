import { createMessage } from "../models/contactModel.js";
import { sendEmail } from "../utils/sendEmail.js";

export const submitContactForm = async (req, res) => {
  const { name, email, subject, message } = req.body;

  await createMessage(name, email, subject, message);

  await sendEmail({
    email,
    subject: "We received your message",
    message: `
Thank you for contacting CartSyy.

Our team will get back to you soon.
    `,
  });

  res.status(201).json({
    success: true,
    message: "Message sent successfully",
  });
};
