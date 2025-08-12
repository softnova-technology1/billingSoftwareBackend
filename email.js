const nodemailer = require("nodemailer");
const sendEmail = async (options) => {
  //send email via mail trap development
  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
      user: process.env.MAILTRAP_USERNAME,
      pass: process.env.MAILTRAP_PASSWORD,
    },
  });

  const mailOptions = {
    from: "alagammai <alagulakshmanan10398@gmail.com>",
    to: options.email,
    subject: options.subject,
    html: `<p>Click below link to reset the password</p>
        <a href="${options.text}">${options.text}</a>`,
    text: options.text,
  };
  await transporter.sendMail(mailOptions);
};
module.exports = sendEmail;
