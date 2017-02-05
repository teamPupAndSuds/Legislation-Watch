var nodemailer = require('nodemailer');
var Bill = require('./../../db/models/bill');
var User = require('./../../db/models/user');
var mongoose = require('mongoose');
var emailPassword = require('./api_config.js');

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
  var allKeys = {};
  var keys = Object.keys(keywordObj);
  var tasksTotal = keys.length;
  if (tasksTotal === 0) {
    cb(null, '<h2>Please add topics to your profile. Visit Legislature Watch for more info</h2>');
  } else {
    for (var key in keywordObj) {
      (function(key) {
        var billsToGo = keywordObj[key]['relatedBills'].length;
        for (var i = 0; i < keywordObj[key]['relatedBills'].length; i++) {
          Bill.findOne({'bill_id': keywordObj[key]['relatedBills'][i]}, function(err, bill) {
            if (err) {
              console.log('This is an error in addBills');
              cb(err);
            } else {
              var resultDate = bill['last_version_on'];
              if (resultDate === date) {
                result += "<h2> Keyword: " + key + "</h2>";
                result += "<h4 style='color:grey;'> Bill ID: " + bill['bill_id'] + "</h2>";
                result += '<h3>' + bill['official_title'] + '</h3>';
                result += '<h3>--------------------------</h3>';
              }
              billsToGo--;
              allKeys[key] = key;
              if (tasksTotal === Object.keys(allKeys).length && billsToGo === 0) {
                if (result.length === 0) {
                  result = '<h3>No new bills related to your topics today.</h3>';
                }
                cb(null, result);
              }
            }
          });
        }
      })(key);
    }
  }
};

exports.sendMail = function(userObj, cb) {
  //start construction body of email
  let insertHtml = "<h1>Here's what's happening today in congress. Visit <span style='color:blue;'>Legislature Watch</span> for more results!<br>";

  //FOR TESTING ONLY: 2017-01-09
  // var date = '2017-01-03';

  //USE THIS DATE FOR THE REAL THING - Grabs today's date
  var date = formatDate();

  addBills(userObj.keywords, date, function(err, result) {
    if (err) {
      console.log('Something went wrong');
      return;
    } else {

      insertHtml += result;

      let mailOptions = {
        from: '"Legislature Watch" <legislaturewatch@gmail.com>', // sender address
        to: userObj.email, // list of receivers
        subject: '[Legislature Watch] Your Daily Digest ' + date, // Subject line
        html: insertHtml // html body
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
        cb(null, userObj);
        process.exit();
      });
    }
  });
};

//Access the user database, then calls exports.sendMail for each user in result array
User.find({}, function(err, result) {
  if (err) {
    console.log('Something went wrong when accessing users table', err);
  } else {
    //to prevent the process from exiting before all mail is sent
    var count = 0;
    result.forEach(function(user) {
      exports.sendMail(user, function(err, end) {
        if (err) {
          console.log('There was an error with sendMail function', err);
        } else {
          count++;
          //if count equals the length of users in database minus 1
          if (count === result.length - 1) {
            console.log('sendMail process complete');
            process.exit();
          }
        }
      });
    });
  }
});
