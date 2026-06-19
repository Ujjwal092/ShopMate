import { createMessage } from "../models/contactModel.js";
import { sendEmail } from "../utils/sendEmail.js";
import { generateContactFormEmailTemplate } from "../utils/generateContactFormEmailTemplate.js";

export const submitContactForm = async (req, res) => {
  const { name, email, subject, message } = req.body;

  await createMessage(name, email, subject, message);

  try {
    const emailTemplate = generateContactFormEmailTemplate(
      name,
      subject,
      message,
    );

    await sendEmail({
      email,
      subject: "✅ We received your message",
      message: emailTemplate,
    });
    console.log(`📧 Contact form confirmation sent to ${email}`);
  } catch (emailError) {
    console.error(
      `⚠️ Contact form email send failed for ${email}:`,
      emailError.message,
    );
  }

  res.status(201).json({
    success: true,
    message: "Message sent successfully. We'll get back to you soon!",
  });
};
