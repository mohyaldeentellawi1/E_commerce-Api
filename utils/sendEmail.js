const nodemailer = require('nodemailer');

const sendEmail = async  (options) => {
  
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    const mailOptions = {
        from: `E-commerce <${process.env.EMAIL_USER}>`,
        to: options.emil,
        subject: options.subject,
        text: options.message
    };
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;

  // what is the transporter : service that sends emails (gmail, sendgrid, mailgun, mailtrap)