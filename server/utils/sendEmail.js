import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

 const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false, // true for 465, false for 587
      auth: {
        user: process.env.BREVO_EMAIL,
        pass: process.env.BREVO_SMTP_KEY,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent:", info.response);
    return info;
  } catch (error) {
    console.log("Email error:", error.message);
    throw error;
  }
};

export default sendEmail;