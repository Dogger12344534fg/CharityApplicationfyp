import nodemailer from 'nodemailer';
import dotenv from "dotenv";

dotenv.config();


const sendMail = async ({to, subject, html}) => {
  try {
  const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  });

  const mailOptions = {
      from: 'kisamesamehada1998@gmail.com',  
      to,                   
      subject, 
      html
    };
   const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully!");
    console.log("Message ID:", info.messageId);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
}

export default sendMail;
