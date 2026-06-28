import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text) => {
  try {
    console.log("📧 Email sending started...");

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: true, // SSL
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      connectionTimeout: 10000,
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });

    console.log("✅ Email sent successfully:", info.messageId);
  } catch (error) {
    console.error("❌ Email error:", error.message);
    throw error;
  }
};

export default sendEmail;