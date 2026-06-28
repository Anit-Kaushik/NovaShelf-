import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      auth: {
        user: process.env.BREVO_EMAIL,
        pass: process.env.BREVO_SMTP_KEY,
      },
    });

    console.log("➡️ Starting email send...");
console.log("SMTP KEY EXISTS:", !!process.env.BREVO_SMTP_KEY);
console.log("EMAIL:", process.env.BREVO_EMAIL);

    await transporter.sendMail({
      from: process.env.BREVO_EMAIL,
      to,
      subject,
      text,

    });

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Email error:", error.message);
    throw error;
  }

};

export default sendEmail;