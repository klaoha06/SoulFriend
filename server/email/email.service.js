'use strict';

var path           = require('path'),
  templatesDir   = path.resolve(__dirname, '../..', 'templates'),
  emailTemplates = require('email-templates'),
  nodemailer     = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'puanjai.com@gmail.com',
        pass: config.puanjaiPass
    }
});
var config = require('../config/environment');

function htmlToPlaintext(text) {
  return String(text).replace(/<[^>]+>/gm, '');
}

var toText = htmlToPlaintext(question.body);

var mailOptions = {
    from:  'puanjai.com <puanjai.com@gmail.com>', // sender address
    to: question.owner.email, // list of receivers
    subject: '[puanjai.com] มีคนใจดีช่วยตอบปัญหาใจคุณ!', // Subject line
    text: toText,
    html: '<div><h3>คําถาม "'+ question.name +'" ได้รับการช่วยเหลือจาก ' + user.username + '</h3><br>' + 'มีข้อความดั่งนี้..<br><br><div style="background-color:aliceblue; border: 1px solid #dddddd; border-radius: 4px;">' + question.body + '</div><br><a href="http://puanjai.com/questions/' +question._id+'">ไปดูที่เพื่อนใจ</a></div>' // html body
};
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        console.log(error);
    }else{
        console.log('Message sent: ' + info.response);
    }
});

exports.isAuthenticated = isAuthenticated;
exports.hasRole = hasRole;
exports.signToken = signToken;
exports.setTokenCookie = setTokenCookie;