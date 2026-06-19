export const generateStockAlertEmailTemplate = (
  productName,
  productImage,
  productPrice,
  productId,
) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const productUrl = `${frontendUrl}/product/${productId}`;

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Product Back in Stock</title>
  </head>
  <body style="margin:0; padding:0; background-color:#0f0f0f; font-family: 'Segoe UI', Roboto, Arial, sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 0;">
      <tr>
        <td align="center">

          <table width="600" cellpadding="0" cellspacing="0" style="background:#151515; border-radius:12px; overflow:hidden; box-shadow:0 10px 40px rgba(0,0,0,0.4);">

            <!-- Header -->
            <tr>
              <td style="padding:30px; text-align:center; background:linear-gradient(135deg,#10b981,#059669);">
                <h1 style="margin:0; font-size:24px; color:#ffffff;">🎉 Great News!</h1>
                <p style="margin:8px 0 0; font-size:14px; color:#e5e7eb;">
                  Your waitlisted product is back in stock
                </p>
              </td>
            </tr>

            <!-- Product Image & Details -->
            <tr>
              <td style="padding:30px; text-align:center; background:#1a1a1a;">
                ${
                  productImage
                    ? `<img src="${productImage}" alt="${productName}" style="max-width:300px; height:auto; border-radius:8px; margin-bottom:20px;" />`
                    : ""
                }
                <h2 style="margin:20px 0 10px; color:#ffffff; font-size:20px;">
                  ${productName}
                </h2>
                <p style="margin:0; font-size:16px; color:#10b981; font-weight:bold;">
                  ${productPrice}
                </p>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding:35px; color:#e5e7eb;">
                <p style="font-size:15px; line-height:1.8; color:#d1d5db; margin:0 0 20px;">
                  Hi there! 👋 <br /><br />
                  Exciting news! The product you were waiting for is now <strong style="color:#10b981;">back in stock</strong>. 
                  Don't miss out – grab it before it runs out again!
                </p>

                <!-- Urgency Message -->
                <div style="background:#10b981/20; border-left:4px solid #10b981; padding:15px; border-radius:4px; margin:25px 0;">
                  <p style="margin:0; font-size:14px; color:#10b981; font-weight:600;">
                    ⏰ Limited time offer - Stock is limited!
                  </p>
                </div>

                <!-- CTA Button -->
                <div style="text-align:center; margin:30px 0;">
                  <a href="${productUrl}"
                    style="
                      display:inline-block;
                      padding:16px 32px;
                      font-size:16px;
                      font-weight:600;
                      color:#ffffff;
                      text-decoration:none;
                      border-radius:8px;
                      background:linear-gradient(135deg,#10b981,#059669);
                      transition:all 0.3s;
                    ">
                    Shop Now
                  </a>
                </div>

                <p style="font-size:14px; line-height:1.6; color:#9ca3af;">
                  This is an automated notification for the product you subscribed to. 
                  If you're no longer interested, you can manage your alerts in your account settings.
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
