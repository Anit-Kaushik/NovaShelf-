import nodemailer from "nodemailer";//Brings Nodemailer library into your project
import dotenv from "dotenv";
dotenv.config();


const sendEmail = async (to, subject, text) => { //👉 Function named sendEmail 👉 Takes 3 inputs: to → receiver email, subject → email title , text → email message
    //async tells JavaScript: 👉 “This function may take some time. Wait properly.”
    try {
    const transporter = nodemailer.createTransport({//Create transporter email sending machine
      service: "gmail", //Tells system to use Gmail for sending emails
      auth: {
        user: process.env.EMAIL_USER,//your Gmail
        pass: process.env.EMAIL_PASS//Gmail app password (not normal password)
      }
    });

    await transporter.sendMail({//👉 Actually sends email 👉 await means wait until email is sent
      from: process.env.EMAIL_USER, //Email is sent from your Gmail account
      to, //Person who will receive email
      subject,//Email title
      text //Main email content
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.log("Email error:", error.message);
    console.log("cannot send otp");
  }
};



export default sendEmail;