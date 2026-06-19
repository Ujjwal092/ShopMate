import nodeMailer from "nodemailer";

export const sendEmail = async ({ email, subject, message }) => {
  try {
    const transporter = nodeMailer.createTransport({
      host: process.env.SMTP_HOST,
      service: process.env.SMTP_SERVICE,
      port: Number(process.env.SMTP_PORT),
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"CartSyy" <${process.env.SMTP_MAIL}>`,
      to: email,
      subject,
      html: message,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${email}:`, info.response);
    return info;
  } catch (error) {
    console.error(`❌ Failed to send email to ${email}:`, error.message);
    throw new Error(`Email sending failed: ${error.message}`);
  }
};
