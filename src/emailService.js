require('dotenv').config()

const nodemailer = require('nodemailer');

let transporter
function createTransport() {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });
  console.log("Email service with toivobot created! at %o", new Date())

}

function sendMail(text) {
  console.log("Sending mail! %o", Date())

  //PUT correct addresses in here
   
  var mailOptions = {
    from: process.env.MAIL_FROM,
    to: process.env.MAIL_TO,
    subject: 'Päivän elokuvat',
    text: text
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

}
module.exports = {
  createTransport: createTransport,
  sendMail: sendMail
}

