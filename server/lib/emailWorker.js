var nodemailer = require('nodemailer');
var Bill = require('./../../db/models/bill');
var mongoose = require('mongoose');
var emailPassword = require('./api_config.js');

//comment me out when we know where this db is going to be initialized
mongoose.connect('mongodb://localhost/billfetchertest');

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

//mvp way of adding the bills to email
var addBills = function(keywordObj, date, cb) {
  var result = '';
  var keys = Object.keys(keywordObj);
  var tasksToGo = keys.length;
  if (tasksToGo === 0) {
    cb(null, '<h2>Please add topics to your profile. Visit Legislature Watch for more info</h2>');
  } else {
    for (var key in keywordObj) {
      result += '<h2>' + key + '</h2><br>';
      for (var i = 0; i < keywordObj[key]['relatedBills'].length; i++) {
        Bill.findOne({'bill_id': keywordObj[key]['relatedBills'][i]}, function(err, bill) {
          if (err) {
            console.log('This is an error in addBills');
            cb(err);
          } else {
            var resultDate = bill['last_version_on'];
            console.log(key);
            console.log(i);
            if (resultDate === date) {
              result += '<h3>' + bill['official_title'] + '</h3>';
            }
            if (--tasksToGo === 0) {
              cb(null, result);
            }
          }
        });
      }
    }
  }
};

exports.sendMail = function(userObj, cb) {
  //start construction body of email
  let insertHtml = "<h1>Here's what's happening today in congress. Visit <b>Legislature Watch</b> for more results!<br><br><br>";

  //test date 2017-01-09
  var date = '2017-01-09';

  //use this for the real thing******
  // var date = formatDate();

  addBills(userObj.keywords, date, function(err, result) {
    if (err) {
      console.log('Something went wrong');
      return;
    } else {

      insertHtml += result;

      let mailOptions = {
        from: '"Legislature Watch" <legislaturewatch@gmail.com>', // sender address
        to: userObj.email, // list of receivers
        subject: '(Legislature Watch) Your Daily Digest. YAY! ' + date, // Subject line
        html: insertHtml // html body
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
        process.exit();
      });
    }
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
    'bird': {
      word: 'bird',
      relatedBills: ['hr368-115']
    },
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
    }
  },
  email: 'c.bathgate1@gmail.com'
};

exports.sendMail(user, function() {
  console.log('YAYYYYAYAYYAYAYA');
});
