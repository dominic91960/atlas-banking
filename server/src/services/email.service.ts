import { BrevoClient } from "@getbrevo/brevo";

const apiKey = process.env.BREVO_API_KEY;
const senderEmail = process.env.BREVO_SENDER_EMAIL;
const senderName = process.env.BREVO_SENDER_NAME;

if (!apiKey) {
  throw new Error("BREVO_API_KEY is not configured");
}

if (!senderEmail) {
  throw new Error("BREVO_SENDER_EMAIL is not configured");
}

if (!senderName) {
  throw new Error("BREVO_SENDER_NAME is not configured");
}

const brevoClient = new BrevoClient({
  apiKey,
  timeoutInSeconds: 30,
  maxRetries: 2,
});

export const sendRegistrationOTP = async (
  recipientEmail: string,
  otpCode: string
): Promise<void> => {
  await brevoClient.transactionalEmails.sendTransacEmail({
    sender: {
      email: senderEmail,
      name: senderName,
    },

    to: [
      {
        email: recipientEmail,
      },
    ],

    subject: "Atlas Banking registration verification code",

    htmlContent: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
        </head>

        <body style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 30px;">
          <div style="
            max-width: 550px;
            margin: auto;
            background-color: white;
            padding: 30px;
            border-radius: 8px;
          ">
            <h2>Atlas Banking</h2>

            <p>
              We received a request to create an online banking account
              associated with this email address.
            </p>

            <p>Your verification code is:</p>

            <div style="
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 8px;
              margin: 24px 0;
            ">
              ${otpCode}
            </div>

            <p>This code expires in five minutes.</p>

            <p>
              Do not share this verification code with anyone.
              Atlas Banking staff will never ask you for this code.
            </p>

            <p>
              If you did not request this verification code, you can ignore
              this email.
            </p>
          </div>
        </body>
      </html>
    `,
  });
};