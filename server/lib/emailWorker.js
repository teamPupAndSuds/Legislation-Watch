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

var formatDate = function() {
  var d = new Date(),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) {
    month = '0' + month;
  }
  if (day.length < 2) {
    day = '0' + day;
  } 
  return [year, month, day].join('-');
};

exports.sendMail = function(userObj, cb) {
  //start construction body of email
  let insertHtml = "<h1>Here's what's happening today in congress. Visit Legislature Watch for more results!</h1><br><br><h2>This is the first heading</h2><br><br><h2>This is the second heading</h2>";

  var date = formatDate();

  let mailOptions = {
    from: '"Legislature Watch" <legislaturewatch@gmail.com>', // sender address
    to: userObj.email, // list of receivers
    subject: '(Legislature Watch) Your Daily Digest ' + date, // Subject line
    html: insertHtml // html body
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
  keywords: { 
    'abortion': {
      word: 'abortion',
      relatedBills: 
      ['hr217-115',
       'hr524-115',
       'hr277-115',
       'hr354-115',
       'hr352-115',
       'hr147-115',
       'hr37-115',
       'hr7-115',
       'hr586-115',
       'hr36-115',
       'hr771-115'] 
    },

  },
  email: 'c.bathgate1@gmail.com'
};

exports.sendMail(user, function() {
  console.log('YAYYYYAYAYYAYAYA');
});
