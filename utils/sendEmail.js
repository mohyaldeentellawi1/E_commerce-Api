const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRIP_HOST,
    port: process.env.MAILTRIP_PORT,
    secure: false,
    auth: {
      user: process.env.MAILTRIP_USER,
      pass: process.env.MAILTRIP_PASSWORD,
    },
  });
  const mailOptions = {
    from: options.from,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;

// what is the transporter : service that sends emails using (Gmail or SendGrid or mailgun or mailtrap)
// I can build transport using nodemailer.createTransport() method
