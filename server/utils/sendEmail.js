import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const sendEmail = async (to, subject, text) => {
  try {
    
    
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_EMAIL,
        pass: process.env.BREVO_SMTP_KEY,
      },
    });

    // await transporter.verify();
    console.log("Brevo SMTP connected");

    const info = await transporter.sendMail({
      from: `"NovaShelf" <${process.env.SENDER_EMAIL}>`,
      to,
      subject,
      text,
    });

    console.log("Email sent:", info.messageId);

    return info;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default sendEmail;