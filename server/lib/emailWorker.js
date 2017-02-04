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

exports.sendMail = function(userObj, cb) {
  // setup email data with unicode symbols
  let insertHtml = '';

  let mailOptions = {
    from: '"Legislature Watch" <legislaturewatch@gmail.com>', // sender address
    to: userObj.email, // list of receivers
    subject: '(Legislature Watch) Your Daily Digest', // Subject line
    html: '<b>Hello world ?</b>' // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
  });
};


//assume passing in whole user object

/////////////////////////////////////
//////////TESTING ZONE///////////////
/////////////////////////////////////

//PLEASE COMMENT OUT BEFORE SUBMITTING

var user = {
  username: 'cbathgate',
  password: 'qwerty',
  location: {
    houseNum: '123',
    street: 'Rainbow Road',
    city: 'Oakland',
    state: 'CA',
  },
  latitude: 37.8019553,
  longitude: -122.2999646,
  keywords: {},
  email: 'c.bathgate1@gmail.com'
};

exports.sendMail(user, function() {
  console.log('YAYYYYAYAYYAYAYA');
});
