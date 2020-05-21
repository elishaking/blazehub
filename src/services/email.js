const nodemailer = require("nodemailer");

/**
 * Generate mail message
 *
 * @param {string} heading
 * @param {string} body
 * @param {string} linkHref
 * @param {string} link
 */
const generateMailMessage = (heading, body, linkHref, link) => {
  const message = `
    <div style="color: #7C62A9;">
      <h1>BlazeHub 💬💬💬</h1>
      <img src="https://quotz.skyblazar.com/img/logo.png" />
      <p>${heading}</p>
      <br>
      <p>${body}</p>
      <br/>
      <a href="${linkHref}" style="padding: 0.5em 1em; border-radius: 5px; background: #7C62A9; color: white; text-decoration: none;">${link}</a>
    </div>
  `;

  return message;
};

/**
 * Send mail to `receiverAddress`
 *
 * @param {string} subject
 * @param {string} message
 * @param {string} receiverAddress
 */
const sendMail = async (subject, message, receiverAddress) => {
  const emailSender = {
    user: process.env.EMAIL,
    password: process.env.EMAIL_PASSWORD,
  };

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailSender.user,
      pass: emailSender.password,
    },
  });

  const info = await transporter
    .sendMail({
      from: "BlazeHub",
      to: receiverAddress,
      subject: subject,
      html: message,
    })
    .catch((err) => {
      console.log(err);

      throw err;
    });

  return info;
};

module.exports = { sendMail };
