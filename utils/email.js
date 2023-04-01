const nodemailer = require("nodemailer");

const sendEmail = async options => {
  // 1) Create a Transporter

  var transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 25,
    auth: {
      user: "8e1d86682fb1f3",
      pass: "3d0d7841c26ebf"
    }
  });

  // 2) Define the email options

  const mailOptions = {
    from: "Akila Perera <hello@akilaperera.io>",
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  // 3) Actually send the email

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
