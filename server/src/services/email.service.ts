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

export const sendPasswordResetEmail = async (
  recipientEmail: string,
  resetLink: string,
  expiryMinutes: number
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

    subject: "Reset your Atlas Banking password",

    htmlContent: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
        </head>

        <body style="
          font-family: Arial, sans-serif;
          background-color: #f4f6f8;
          padding: 30px;
        ">
          <div style="
            max-width: 550px;
            margin: auto;
            background-color: white;
            padding: 30px;
            border-radius: 8px;
          ">
            <h2>Atlas Banking</h2>

            <p>
              We received a request to reset the password for your
              online banking account.
            </p>

            <p>
              Click the button below to create a new password.
            </p>

            <p style="margin: 30px 0;">
              <a
                href="${resetLink}"
                style="
                  background-color: #1d4ed8;
                  color: white;
                  padding: 12px 20px;
                  text-decoration: none;
                  border-radius: 6px;
                  display: inline-block;
                "
              >
                Reset Password
              </a>
            </p>

            <p>
              This password-reset link expires in
              ${expiryMinutes} minutes and can only be used once.
            </p>

            <p>
              Do not share this link with anyone. Atlas Banking staff
              will never ask you for your password-reset link.
            </p>

            <p>
              If you did not request a password reset, you can safely
              ignore this email. Your existing password will remain
              unchanged.
            </p>
          </div>
        </body>
      </html>
    `,

    textContent: `
Atlas Banking Password Reset

We received a request to reset your online banking password.

Open the following link to create a new password:

${resetLink}

This link expires in ${expiryMinutes} minutes and can only be used once.

If you did not request this password reset, you can ignore this email.
    `.trim(),
  });
};


export const sendTransactionOTP = async (
  recipientEmail: string,
  otpCode: string,
  receiverAccountNumber: string,
  amount: string
): Promise<void> => {
  const maskedReceiver =
    maskAccountNumber(receiverAccountNumber);

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

    subject: "Atlas Banking transaction verification code",

    htmlContent: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
        </head>

        <body style="
          font-family: Arial, sans-serif;
          background-color: #f4f6f8;
          padding: 30px;
        ">
          <div style="
            max-width: 550px;
            margin: auto;
            background-color: white;
            padding: 30px;
            border-radius: 8px;
          ">
            <h2>Atlas Banking</h2>

            <p>
              We received a request to transfer
              <strong>${escapeHTML(amount)}</strong>
              to account
              <strong>${escapeHTML(maskedReceiver)}</strong>.
            </p>

            <p>Your transaction verification code is:</p>

            <div style="
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 8px;
              margin: 24px 0;
            ">
              ${escapeHTML(otpCode)}
            </div>

            <p>This code expires in five minutes.</p>

            <p>
              Do not share this code with anyone.
              Atlas Banking staff will never request it.
            </p>

            <p>
              If you did not start this transaction,
              do not use the code and contact the bank.
            </p>
          </div>
        </body>
      </html>
    `,

    textContent: `
Atlas Banking Transaction Verification

A transfer of ${amount} was requested to account ${maskedReceiver}.

Verification code: ${otpCode}

This code expires in five minutes.

Do not share this code with anyone.
    `.trim(),
  });
};

const maskAccountNumber = (
  accountNumber: string
): string => {
  if (accountNumber.length <= 4) {
    return "*".repeat(accountNumber.length);
  }

  return (
    "*".repeat(accountNumber.length - 4) +
    accountNumber.slice(-4)
  );
};

const escapeHTML = (value: string): string => {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
};