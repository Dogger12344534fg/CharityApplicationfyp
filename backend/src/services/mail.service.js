import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transport.sendMail({
      from: `"Setu" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      text,
      html: html || `<p>${text}</p>`,
    });
    console.log("Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Email sending failed");
  }
};

export const sendThemedEmail = async (to, subject, title, bodyText, detailsHtml = "", buttonText = null, buttonLink = null, footerText = "If you weren't expecting this, you can safely ignore this email.") => {
  const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
      <div style="background:#0f3d23;padding:24px;border-radius:12px 12px 0 0;text-align:center;">
        <h1 style="color:white;margin:0;">Setu</h1>
      </div>
      <div style="background:white;padding:32px;border:1px solid #e5e7eb;border-top:0;border-radius:0 0 12px 12px;">
        <h2 style="color:#111827;">${title}</h2>
        <p style="color:#4b5563;font-size:16px;line-height:1.5;">${bodyText}</p>
        
        ${detailsHtml ? `
          <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin:24px 0;">
            ${detailsHtml}
          </div>
        ` : ""}
        
        ${buttonText && buttonLink ? `
          <div style="margin-top:32px;text-align:center;">
            <a href="${buttonLink}" style="display:inline-block;background:#156839;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:600;">
              ${buttonText}
            </a>
          </div>
        ` : ""}
        
        <p style="color:#9ca3af;font-size:12px;margin-top:32px;border-top:1px solid #e5e7eb;padding-top:16px;">
          ${footerText}
        </p>
      </div>
    </div>
  `;
  return sendEmail(to, subject, bodyText, html);
};

export default sendEmail;
