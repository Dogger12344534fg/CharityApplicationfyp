import emailjs from "@emailjs/nodejs";
import dotenv from "dotenv";

dotenv.config();

const keys = {
  publicKey: process.env.EMAILJS_PUBLIC_KEY,
  privateKey: process.env.EMAILJS_PRIVATE_KEY,
};

// For OTP emails — uses EMAILJS_OTP_TEMPLATE_ID
// Template vars: to_email, subject, title, greeting, sub_text, otp_code, badge
export const sendOtpEmail = async (to, subject, { title, greeting = "", subText, otpCode, badge = "" }) => {
  try {
    const response = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_OTP_TEMPLATE_ID,
      {
        to_email: to,
        subject,
        title,
        greeting,
        sub_text: subText,
        otp_code: String(otpCode),
        badge,
      },
      keys,
    );
    console.log("OTP email sent:", response.status);
    return response;
  } catch (error) {
    console.error("Failed to send OTP email:", error);
    throw new Error("Email sending failed");
  }
};

// For notification emails — uses EMAILJS_THEMED_TEMPLATE_ID
// Template vars: to_email, subject, title, body_text, details_text, button_text, button_url, footer_text
export const sendThemedEmail = async (
  to,
  subject,
  title,
  bodyText,
  detailsHtml = "",
  buttonText = null,
  buttonLink = null,
  footerText = "If you weren't expecting this, you can safely ignore this email.",
) => {
  try {
    // Strip HTML tags from detailsHtml — EmailJS cannot render HTML variables
    const detailsText = detailsHtml
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const response = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_THEMED_TEMPLATE_ID,
      {
        to_email: to,
        subject,
        title,
        body_text: bodyText,
        details_text: detailsText,
        button_text: buttonText || "",
        button_url: buttonLink || "#",
        footer_text: footerText,
      },
      keys,
    );
    console.log("Themed email sent:", response.status);
    return response;
  } catch (error) {
    console.error("Failed to send themed email:", error);
    throw new Error("Email sending failed");
  }
};

export default sendThemedEmail;
