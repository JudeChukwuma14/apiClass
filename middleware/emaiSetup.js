const nodemailer = require("nodemailer");

const host = process.env.SMTP_HOST || "sandbox.smtp.mailtrap.io";
const port = process.env.SMTP_PORT || 587;
const user = process.env.SMTP_USER || "09e24bb460979c";
const pass = process.env.SMTP_PASS || "50280f868d64ee";

const MailSending = (option) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 587,
      secure: false, // true for port 465, false for other ports
      auth: {
        user: "09e24bb460979c",
        pass: "50280f868d64ee",
      },
    });

    const mailOptions = {
      from: "mayowahq@gmail.com",
      to: option.email,
      subject: option.subject,
      text: option.message,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error occurred");
        console.log(error.message);
        return false;
      } else {
        console.log("Everything is working fine");
        console.log("Email sent: " + info.response);
        return true;
      }
    });
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

module.exports = MailSending;