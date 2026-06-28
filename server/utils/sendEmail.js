import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.BREVO_EMAIL,
    pass: process.env.BREVO_SMTP_KEY,
  },
  connectionTimeout: 10000,
});



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