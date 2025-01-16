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
    from: options.from, //`E-commerce <${process.env.EMAIL_USER}>`
    to: options.emil,
    subject: options.subject,
    text: options.message,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;

// what is the transporter : service that sends emails using (Gmail or SendGrid or mailgun or mailtrap)
// I can build transport using nodemailer.createTransport() method

////////////////////////////////////////

// another way bu use mailtap
/*
const nodemailer = require("nodemailer");
const { MailtrapTransport } = require("mailtrap");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport(
    MailtrapTransport({
      token: process.env.Mailtrip_API_TOKEN,
    })
  );
  const mailOptions = {
    from: options.from,
    to: options.emil,
    subject: options.subject,
    text: options.message,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
*/
