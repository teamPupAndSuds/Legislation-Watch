var nodemailer = require('nodemailer');
var emailPassword = require('./api_config.js');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'legislaturewatch@gmail.com',
    pass: emailPassword.emailPassword
  }
});

// setup email data with unicode symbols
let mailOptions = {
  from: '"Cynthia" <legislaturewatch@gmail.com>', // sender address
  to: 'c.bathgate1@gmail.com', // list of receivers
  subject: 'Hello ✔', // Subject line
  text: 'Hello world ?', // plain text body
  html: '<b>Hello world ?</b>' // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info) {
  if (error) {
    return console.log(error);
  }
  console.log('Message %s sent: %s', info.messageId, info.response);
});