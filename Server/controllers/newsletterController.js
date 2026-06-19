import ErrorHandler from "../middlewares/errorMiddleware.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";

import {
  createSubscriber,
  getSubscriberByEmail,
  getAllSubscribers,
  deleteSubscriber,
} from "../models/newsletterModel.js";

import { sendEmail } from "../utils/sendEmail.js";

import { generateNewsletterEmailTemplate } from "../utils/generateForgotPasswordEmailTemplate.js"; // path apna check kar

export const subscribeNewsletter = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new ErrorHandler("Please provide email.", 400));
  }

  const existingSubscriber = await getSubscriberByEmail(email);

  if (existingSubscriber.rows.length > 0) {
    return next(new ErrorHandler("Email already subscribed.", 400));
  }

  await createSubscriber(email);

  try {
    await sendEmail({
      email,
      subject: "Welcome to CartSyy 🎉",
      message: generateNewsletterEmailTemplate(email),
    });
    console.log(`📧 Newsletter welcome email sent to ${email}`);
  } catch (emailError) {
    console.error(
      `⚠️ Newsletter email send failed for ${email}:`,
      emailError.message,
    );
    return next(
      new ErrorHandler(
        "Subscription successful, but welcome email could not be sent. Please check your email settings.",
        500,
      ),
    );
  }

  res.status(201).json({
    success: true,
    message: "Subscribed successfully. Check your email for confirmation.",
  });
});
export const fetchAllSubscribers = catchAsyncErrors(async (req, res, next) => {
  const subscribers = await getAllSubscribers();

  res.status(200).json({
    success: true,
    count: subscribers.rows.length,
    subscribers: subscribers.rows,
  });
});

export const removeSubscriber = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const deletedSubscriber = await deleteSubscriber(id);

  if (deletedSubscriber.rows.length === 0) {
    return next(new ErrorHandler("Subscriber not found.", 404));
  }

  res.status(200).json({
    success: true,
    message: "Subscriber removed successfully.",
  });
});
