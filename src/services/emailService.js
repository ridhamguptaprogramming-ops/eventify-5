const nodemailer = require("nodemailer");

let transporter;

const getTransporter = () => {
  if (transporter) {
    return transporter;
  }

  if (process.env.SMTP_HOST) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: process.env.SMTP_USER
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        : undefined
    });

    return transporter;
  }

  transporter = nodemailer.createTransport({
    jsonTransport: true
  });

  return transporter;
};

const sendVerificationEmail = async ({ email, name, token }) => {
  const baseUrl = process.env.CLIENT_URL || "http://localhost:5000";
  const verificationLink = `${baseUrl.replace(/\/$/, "")}/verify?token=${token}`;

  const info = await getTransporter().sendMail({
    from: process.env.SMTP_FROM || "Eventify Nexus <no-reply@eventify.dev>",
    to: email,
    subject: "Verify your Eventify account",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 24px;">
        <h2 style="margin-bottom: 8px;">Welcome to Eventify Nexus</h2>
        <p style="margin-top: 0;">Hi ${name}, thanks for signing up. Verify your email to unlock your dashboard and attendance QR pass.</p>
        <a href="${verificationLink}" style="display:inline-block; margin: 20px 0; padding: 14px 22px; border-radius: 999px; text-decoration:none; background:#5eead4; color:#04131a; font-weight:700;">Verify Email</a>
        <p style="color:#64748b;">If the button does not work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color:#0f172a;">${verificationLink}</p>
      </div>
    `
  });

  if (!process.env.SMTP_HOST) {
    console.log("Verification email preview:", info.message);
    console.log("Verification link:", verificationLink);
  }
};

module.exports = {
  sendVerificationEmail
};
