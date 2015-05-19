'use strict';

var path           = require('path'),
  templatesDir   = path.resolve(__dirname, '../', 'templates'),
  emailTemplates = require('email-templates'),
  nodemailer     = require('nodemailer'),
  config = require('../config/environment'),
  crypto = require('crypto');


// Prepare nodemailer transport object
var transport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'puanjai.com@gmail.com',
        pass: config.puanjaiPass
    }
});


      // Send a single email on new ans
      exports.sendEmailOnNewAns = function(locals) {      
        emailTemplates(templatesDir, function(err, template) {
          
          if (err) {
              console.log(err);
            } else {

              // Send a single email
              template('newAnswerEmail', locals, function(err, html, text) {
                if (err) {
                  console.log(err);
                } else {
                  transport.sendMail({
                    from: 'puanjai.com <puanjai.com@gmail.com>',
                    to: locals.question.owner.email,
                    subject: '[puanjai.com] มีคนใจดีช่วยตอบปัญหาใจคุณ!',
                    html: html,
                    // generateTextFromHTML: true,
                    text: text
                  }, function(err, responseStatus) {
                    if (err) {
                      console.log(err);
                    } else {
                      console.log(responseStatus.response);
                    }
                  });
                }
              });
            }
        });
      }

      // Send a single email on sign up
      exports.sendEmailOnSignUp = function(locals) {
        emailTemplates(templatesDir, function(err, template) {
                  if (err) {
                      console.log(err);
                    } else {
                      // Send a single email
                      template('welcomeEmail', locals, function(err, html, text) {
                        if (err) {
                          console.log(err);
                        } else {
                          transport.sendMail({
                            from: 'puanjai.com <puanjai.com@gmail.com>',
                            to: locals.email,
                            subject: 'ยืนดีตอนรับสู่เพื่อนใจ กรุณาช่วยยืนยันอีเมลขอบคุณด้วยครับ',
                            html: html,
                            // generateTextFromHTML: true,
                            text: text
                          }, function(err, responseStatus) {
                            if (err) {
                              console.log(err);
                            } else {
                              console.log(responseStatus.response);
                            }
                          });
                        }
                      });
                    }
                });
      }
