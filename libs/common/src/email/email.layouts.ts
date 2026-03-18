import moment from "moment-timezone";

export interface BaseEmailLayoutProps {
  body: string;
  title: string;
}

export function baseEmailLayout({ body, title }: BaseEmailLayoutProps): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>${title} - Preferental</title>
        <style>
          @media only screen and (max-width: 600px) {
            .container {
              width: 100% !important;
              padding: 0 15px !important;
            }
            body {
              background-color: #ffffff !important;
              margin: 0 !important;
              padding: 0 !important;
              width: 100% !important;
            }
            .button {
              display: inline-block !important;
              width: auto !important;
              text-align: center !important;
              padding: 16px 24px !important;
              margin: 0 auto !important;
            }
            .button-container {
              padding: 0 15px !important;
            }
            .content-padding {
              padding: 30px 20px !important;
            }
            .heading {
              font-size: 24px !important;
            }
            .subheading {
              font-size: 18px !important;
            }
            .body-text {
              font-size: 15px !important;
            }
            table[role="presentation"] {
              width: 100% !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            td[align="center"] {
              padding: 0 !important;
            }
            img {
              width: 100% !important;
              max-width: 100% !important;
              height: auto !important;
              border-radius: 8px 8px 0 0 !important;
            }
            .mobile-table {
              width: 100% !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            .mobile-content {
              padding: 20px !important;
              margin: 0 !important;
            }
            .mobile-footer {
              padding: 20px !important;
              margin: 0 !important;
            }
            .feature-number {
              width: 24px !important;
              height: 24px !important;
              font-size: 14px !important;
            }
            .checkmark {
              width: 28px !important;
              height: 28px !important;
              font-size: 16px !important;
            }
            .otp-code {
              font-size: 28px !important;
              letter-spacing: 6px !important;
            }
            table[role="presentation"] > tr > td {
              border-radius: 8px !important;
            }
            .mobile-table > table {
              border-radius: 8px !important;
            }
            .mobile-content > table {
              border-radius: 8px !important;
            }
            .mobile-footer > table {
              border-radius: 0 0 8px 8px !important;
            }
            .mobile-table > img {
              border-radius: 8px 8px 0 0 !important;
            }
            .mobile-content > div {
              border-radius: 8px !important;
            }
            .mobile-footer > div {
              border-radius: 0 0 8px 8px !important;
            }
            /* Fix for mobile body margins */
            body > table {
              margin: 0 !important;
              padding: 0 !important;
            }
            body > table > tbody > tr > td {
              padding: 0 !important;
            }
            /* Ensure content doesn't get cut off */
            .content-padding {
              padding-bottom: 30px !important;
            }
            .mobile-footer {
              padding-bottom: 30px !important;
            }
            /* Fix table cell spacing */
            td {
              padding: 0 !important;
            }
            /* Ensure proper spacing between sections */
            tr {
              display: table-row !important;
              width: 100% !important;
            }
            /* Fix for iOS mail */
            @supports (-webkit-touch-callout: none) {
              body {
                -webkit-text-size-adjust: 100% !important;
              }
            }
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0; width: 100% !important; font-family: Arial, sans-serif; line-height: 1.6; color: #333333; background-color: #f4f4f4;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="center" style="padding: 20px 0;">
              <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; max-width: 600px; margin: 0 auto; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <!-- Banner -->
                <tr>
                  <td class="mobile-table">
                    <img src="https://preferental.com/wp-content/uploads/2024/10/10.jpg" alt="Preferental Banner" style="width: 100%; max-width: 600px; height: auto; display: block; border-radius: 8px 8px 0 0;">
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td class="content-padding mobile-content" style="padding: 40px 30px; background-color: #ffffff;">
                    ${body}
                  </td>
                </tr>
                 <tr>
                  <td style="padding: 0px 30px 30px 30px; background-color: #ffffff;">
                    <p>Best regards,<br/>The Preferental Team</p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td class="mobile-footer" style="padding: 40px 30px; background-color: #f8f9fa; text-align: center; font-size: 14px; color: #666666; border-radius: 0 0 8px 8px;">
                    <p>
                      This email and any attachments may contain confidential and/or privileged information. If you are not the intended recipient, please delete it immediately.
                    </p>
                    <p>
                      You are receiving this email because you are a registered user of Preferental. For support, please contact us at
                      <a href="mailto:admin@preferental.com">admin@preferental.com</a>.
                    </p>
                    <p style="margin: 0 0 10px 0; font-size: 14px;">© ${moment().format("YYYY")} Preferental. All rights reserved.</p>
                    <p style="margin: 0 0 10px 0; font-size: 14px;">This is an automated message, please do not reply to this email.</p>
                    <p style="margin: 0; font-size: 14px;">For support, contact us at <a href="mailto:admin@preferental.com" style="color: #1988fe; text-decoration: none; font-weight: 600;">admin@preferental.com</a>
                    </a></p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}
