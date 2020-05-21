const nodemailer = require("nodemailer");

const logo = `<svg xmlns="http://www.w3.org/2000/svg" width="130.276" height="95.294" viewBox="0 0 130.276 95.294">
<g id="logo" transform="translate(-1174.476 -299)">
  <path id="Path_1" data-name="Path 1" d="M153.158,268.115a1.17,1.17,0,0,1,1.186-1.1h31.727a7.485,7.485,0,0,0,5.221-2.092,7,7,0,0,0,2.163-5.075,7.342,7.342,0,0,0-7.495-7.116H151.473a2.76,2.76,0,0,1-2.409-1.371,35.494,35.494,0,0,0-3.582-5.179,1.146,1.146,0,0,1,.928-1.865h29.654a7.49,7.49,0,0,0,5.223-2.092,7,7,0,0,0,2.163-5.075,7.342,7.342,0,0,0-7.495-7.116h-66.43q-.668-.016-1.339-.016c-24.856,0-45,16.443-45,36.727s20.149,36.728,45,36.728c12.782,0,24.318-4.347,32.51-11.33a5.824,5.824,0,0,1,3.773-1.389h37.6a7.49,7.49,0,0,0,5.223-2.092,7,7,0,0,0,2.163-5.075,7.341,7.341,0,0,0-7.494-7.116H153.19a1.16,1.16,0,0,1-1.145-1.459A30.357,30.357,0,0,0,153.158,268.115Zm-44.973,21.057c-15.176,0-27.479-10.04-27.479-22.425s12.3-22.425,27.479-22.425,27.479,10.04,27.479,22.425S123.361,289.172,108.185,289.172Z" transform="translate(1111.296 68.979)" fill="#7c62a9"/>
  <ellipse id="Ellipse_1" data-name="Ellipse 1" cx="11.006" cy="10.92" rx="11.006" ry="10.92" transform="translate(1255.085 372.455)" fill="#7c62a9"/>
</g>
</svg>`;

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
      <p>${logo}</p>
      <h1>BlazeHub 💬💬💬</h1>
      <p>${heading}</p>
      <p>${body}</p>
      <a href="${linkHref}" style="padding: 0.5em 1em; border-radius: 5px; background: #7C62A9; color: white; text-decoration: none; display: inline-block;">${link}</a>
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

module.exports = { generateMailMessage, sendMail };
