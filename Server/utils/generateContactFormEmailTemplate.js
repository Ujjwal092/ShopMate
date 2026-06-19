export const generateContactFormEmailTemplate = (
  name,
  subject,
  originalMessage,
) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Contact Form Confirmation</title>
  </head>
  <body style="margin:0; padding:0; background-color:#0f0f0f; font-family: 'Segoe UI', Roboto, Arial, sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 0;">
      <tr>
        <td align="center">

          <table width="600" cellpadding="0" cellspacing="0" style="background:#151515; border-radius:12px; overflow:hidden; box-shadow:0 10px 40px rgba(0,0,0,0.4);">

            <!-- Header -->
            <tr>
              <td style="padding:30px; text-align:center; background:linear-gradient(135deg,#4f46e5,#9333ea);">
                <h1 style="margin:0; font-size:24px; color:#ffffff;">CartSyy</h1>
                <p style="margin:8px 0 0; font-size:14px; color:#e5e7eb;">
                  We received your message 📨
                </p>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding:35px; color:#e5e7eb;">
                <h2 style="margin-top:0; color:#ffffff; font-size:22px;">
                  Thank you for contacting us, ${name}!
                </h2>

                <p style="font-size:15px; line-height:1.6; color:#d1d5db;">
                  We've received your message and our team will get back to you as soon as possible. 
                  We typically respond within 24-48 hours.
                </p>

                <!-- Message Summary -->
                <div style="background:#272727; border-left:4px solid #9333ea; padding:20px; border-radius:4px; margin:25px 0;">
                  <p style="margin:0 0 10px; font-size:12px; color:#9ca3af; font-weight:600;">
                    SUBJECT
                  </p>
                  <p style="margin:0 0 15px; font-size:14px; color:#e5e7eb; font-weight:500;">
                    ${subject}
                  </p>

                  <p style="margin:0 0 10px; font-size:12px; color:#9ca3af; font-weight:600;">
                    YOUR MESSAGE
                  </p>
                  <p style="margin:0; font-size:14px; color:#d1d5db; line-height:1.6; white-space:pre-wrap;">
                    ${originalMessage}
                  </p>
                </div>

                <!-- What's Next -->
                <div style="background:#1a1a1a; padding:20px; border-radius:8px; margin:25px 0;">
                  <h3 style="margin:0 0 15px; color:#ffffff; font-size:14px; font-weight:600;">
                    ✅ What happens next?
                  </h3>
                  <table cellpadding="0" cellspacing="0" style="width:100%;">
                    <tr>
                      <td style="padding:8px 0; font-size:14px; color:#d1d5db;">
                        • Our support team reviews your message
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0; font-size:14px; color:#d1d5db;">
                        • We'll respond via email shortly
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0; font-size:14px; color:#d1d5db;">
                        • Check your inbox &amp; spam folder
                      </td>
                    </tr>
                  </table>
                </div>

                <!-- Contact Info -->
                <p style="font-size:13px; color:#6b7280; margin:25px 0 0; text-align:center;">
                  Have questions? <br />
                  Visit our <strong style="color:#9333ea;">FAQ</strong> or reach out directly.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:25px; text-align:center; background:#0b0b0b;">
                <p style="margin:0; font-size:13px; color:#6b7280;">
                  © ${new Date().getFullYear()} CartSyy. All rights reserved ✨
                </p>
                <p style="margin:6px 0 0; font-size:12px; color:#4b5563;">
                  This is an automated message — please do not reply to this email.
                </p>
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `;
};
