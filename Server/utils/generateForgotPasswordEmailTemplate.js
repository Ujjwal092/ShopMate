export const generateEmailTemplate = (resetPasswordUrl, userName = "User") => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Password Reset</title>
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
                  Your shopping buddy that hates overpaying 💸
                </p>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding:35px; color:#e5e7eb;">
                <h2 style="margin-top:0; color:#ffffff; font-size:22px;">
                  Reset your password
                </h2>

                <p style="font-size:15px; line-height:1.6; color:#d1d5db;">
                  Hi <strong>${userName}</strong>, <br /><br />
                  We received a request to reset your ShopMate account password.
                  Click the button below to securely set a new password.
                </p>

                <!-- Button -->
                <div style="text-align:center; margin:30px 0;">
                  <a href="${resetPasswordUrl}"
                    style="
                      display:inline-block;
                      padding:14px 26px;
                      font-size:15px;
                      font-weight:600;
                      color:#ffffff;
                      text-decoration:none;
                      border-radius:8px;
                      background:linear-gradient(135deg,#6366f1,#a855f7);
                    ">
                    Reset Password
                  </a>
                </div>

                <p style="font-size:14px; line-height:1.6; color:#9ca3af;">
                  This link will expire in <strong>15 minutes</strong> for security reasons.
                  If you didn’t request a password reset, you can safely ignore this email.
                </p>

                <!-- Fallback URL -->
                <p style="font-size:13px; color:#6b7280; margin-top:25px;">
                  Having trouble with the button? Copy and paste this link into your browser:
                </p>

                <p style="font-size:13px; word-break:break-all; color:#8b5cf6;">
                  ${resetPasswordUrl}
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:25px; text-align:center; background:#0b0b0b;">
                <p style="margin:0; font-size:13px; color:#6b7280;">
                  © ${new Date().getFullYear()} ShopMate. All rights reserved✨.
                </p>
                <p style="margin:6px 0 0; font-size:12px; color:#4b5563;">
                  This is an automated message — please do not reply.
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
export const generateNewsletterEmailTemplate = (userEmail) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to CartSyy</title>
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
                  Your shopping buddy that hates overpaying 💸
                </p>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding:35px; color:#e5e7eb;">
                <h2 style="margin-top:0; color:#ffffff; font-size:22px;">
                  Welcome aboard! 🎉
                </h2>

                <p style="font-size:15px; line-height:1.6; color:#d1d5db;">
                  Hey there, <br /><br />
                  Thanks for subscribing to the CartSyy newsletter! You're now part of a
                  community that never overpays. Here's what's coming your way:
                </p>

                <!-- Benefits list -->
                <table cellpadding="0" cellspacing="0" style="margin:24px 0; width:100%;">
                  <tr>
                    <td style="padding:8px 0; font-size:14px; color:#d1d5db;">
                      ✨ &nbsp; New arrivals, before anyone else
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0; font-size:14px; color:#d1d5db;">
                      🎁 &nbsp; Exclusive offers & member-only discounts
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0; font-size:14px; color:#d1d5db;">
                      🔔 &nbsp; Product updates & restocks
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0; font-size:14px; color:#d1d5db;">
                      💰 &nbsp; Flash sale & discount alerts
                    </td>
                  </tr>
                </table>

                <!-- Button -->
                <div style="text-align:center; margin:30px 0;">
                  <a href="${process.env.FRONTEND_URL}"
                    style="
                      display:inline-block;
                      padding:14px 26px;
                      font-size:15px;
                      font-weight:600;
                      color:#ffffff;
                      text-decoration:none;
                      border-radius:8px;
                      background:linear-gradient(135deg,#6366f1,#a855f7);
                    ">
                    Start Shopping
                  </a>
                </div>

                <p style="font-size:13px; color:#6b7280; margin-top:25px;">
                  You're receiving this because you subscribed with <strong>${userEmail}</strong>.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:25px; text-align:center; background:#0b0b0b;">
                <p style="margin:0; font-size:13px; color:#6b7280;">
                  © ${new Date().getFullYear()} CartSyy. All rights reserved✨.
                </p>
                <p style="margin:6px 0 0; font-size:12px; color:#4b5563;">
                  This is an automated message — please do not reply.
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
