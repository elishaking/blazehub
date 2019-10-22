const nodemailer = require('nodemailer');

const sendInviteMail = async (user, receiverEmail) => {
  const message = `
    <div style="color: #7C62A9;">
      <h1>Hi There 💬💬💬</h1>
      <svg id="logo_1" data-name="logo – 1" xmlns="http://www.w3.org/2000/svg" width="116.202" height="73.018" viewBox="0 0 116.202 73.018">
  <path id="Path_1" data-name="Path 1" d="M143.438,264.915a1.055,1.055,0,0,1,1.058-1h28.3A6.586,6.586,0,0,0,177.453,262a6.494,6.494,0,0,0,1.929-4.649,6.629,6.629,0,0,0-6.685-6.519H141.935a2.45,2.45,0,0,1-2.149-1.256,32.551,32.551,0,0,0-3.2-4.744,1.051,1.051,0,0,1,.828-1.709h26.45a6.589,6.589,0,0,0,4.658-1.916,6.493,6.493,0,0,0,1.929-4.649,6.629,6.629,0,0,0-6.685-6.519H104.518q-.6-.014-1.195-.015c-22.171,0-40.143,15.062-40.143,33.642S81.152,297.3,103.323,297.3a44.032,44.032,0,0,0,29-10.379,5.115,5.115,0,0,1,3.365-1.272h33.539a6.59,6.59,0,0,0,4.658-1.916,6.5,6.5,0,0,0,1.929-4.649,6.628,6.628,0,0,0-6.684-6.518H143.466a1.057,1.057,0,0,1-1.022-1.337A28.5,28.5,0,0,0,143.438,264.915ZM103.323,284.2c-13.537,0-24.51-9.2-24.51-20.541s10.973-20.541,24.51-20.541,24.51,9.2,24.51,20.541S116.86,284.2,103.323,284.2Z" transform="translate(-63.18 -230.02)" fill="#7c62a9"/>
  <ellipse id="Ellipse_1" data-name="Ellipse 1" cx="2.889" cy="2.867" rx="2.889" ry="2.867" transform="translate(82.216 67.285)" fill="#7c62a9"/>
</svg>
      <p>Join me at BlazeHub</p>
      <br>
      <p>It is a platform for connecting people: A place to chat, follow interesting conversions and be a part of a growing community</p>
      <br/>
      <a href="https://blazehub.skyblazar.com" style="padding: 0.5em 1em;     border-radius: 5px; background: #7C62A9; color: white; text-decoration: none;">Join Now</p>
    </div>
  `;

  // let testAccount = await nodemailer.createTestAccount();
  const emailAccount = {
    user: process.env.INVITE_EMAIL,
    password: process.env.INVITE_EMAIL_PASSWORD
  };

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'blazehub.skyblazar.com',
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

  console.log('Message sent: %s', info.messageId);
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

  return true;
};

module.exports = sendInviteMail;
