const nodemailer = require('nodemailer');

const sendInviteMail = async (user, receiverEmail) => {
  const message = `
    <div style="color: #7C62A9;">
      <h1>Hi There 💬💬💬</h1>
      <img src="https://quotz.skyblazar.com/img/logo.png" />
      <p>Join me at BlazeHub</p>
      <br>
      <p>It is a platform for connecting people: A place to chat, follow interesting conversions and be a part of a growing community</p>
      <br/>
      <a href="https://blazehub.skyblazar.com" style="padding: 0.5em 1em;     border-radius: 5px; background: #7C62A9; color: white; text-decoration: none;">Join Now</a>
    </div>
  `;

  // let testAccount = await nodemailer.createTestAccount();
  const emailAccount = {
    user: process.env.INVITE_EMAIL,
    password: process.env.INVITE_EMAIL_PASSWORD
  };

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.INVITE_EMAIL_DOMAIN,
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: emailAccount.user,
      pass: emailAccount.password
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `"${user.firstName} ${user.lastName}" ${emailAccount.user}`, // sender address
    to: receiverEmail, //'bar@example.com, baz@example.com', // list of receivers
    subject: 'Join me at BlazeHub 💬💬💬', // Subject line
    text: 'Join me at BlazeHub', // plain text body
    html: message, // html body
  }).catch((err) => {
    console.log(err);
    return false;
  });

  // console.log('Message sent: %s', info.messageId);
  // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

  return true;
};

module.exports = sendInviteMail;
