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
                            subject: 'ยินดีตอนรับสู่เพื่อนใจ กรุณาช่วยยืนยันอีเมลขอบคุณด้วยครับ',
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

      exports.sendOnNewCommentInQuestion = function(locals) {
        emailTemplates(templatesDir, function(err, template) {
                  if (err) {
                      console.log(err);
                    } else {
                      // Send a single email
                      template('newCommentInQuestion', locals, function(err, html, text) {
                        if (err) {
                          console.log(err);
                        } else {
                          transport.sendMail({
                            from: 'puanjai.com <puanjai.com@gmail.com>',
                            to: locals.question.owner.email,
                            subject: 'มีเพื่อนใจมาให้ความคิดเห็นในคําถามคุณ',
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


      exports.sendOnNewCommentInAns = function(locals) {
        emailTemplates(templatesDir, function(err, template) {
                  if (err) {
                      console.log(err);
                    } else {
                      // Send a single email
                      template('newCommentInAns', locals, function(err, html, text) {
                        if (err) {
                          console.log(err);
                        } else {
                          transport.sendMail({
                            from: 'puanjai.com <puanjai.com@gmail.com>',
                            to: locals.answer.email,
                            subject: 'มีเพื่อนใจมาให้ความคิดเห็นในคําตอบของคุณ',
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

      exports.sendOnCreateQuestion = function(users, question){
        emailTemplates(templatesDir, function(err, template) {

          if (err) {
            console.log(err);
          } else {

            // ## Send a batch of emails and only load the template once
            var Render = function(locals, question) {
              this.locals = locals;
              this.locals.question = question;
              this.send = function(err, html, text) {
                if (err) {
                  console.log(err);
                } else {
                  transport.sendMail({
                    from: 'puanjai.com <puanjai.com@gmail.com>',
                    to: locals.email,
                    subject: 'คําถามใหม่จากเพื่อนใจ ' + locals.username,
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
              };
              this.batch = function(batch) {
                batch(this.locals, templatesDir, this.send);
              };
            };

            // Load the template and send the emails
            template('newQuestion', true, function(err, batch) {
              for(var user in users) {
                var render = new Render(users[user], question);
                render.batch(batch);
              }
            });

          }
        });
      }
