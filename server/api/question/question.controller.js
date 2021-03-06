/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Question = require('./question.model');
var User = require('../user/user.model');
var Tag = require('../tag/tag.model');
var wordcut = require("wordcut");
wordcut.init('./node_modules/wordcut/data/tdict-std.txt');
var emailService = require('../../email/email.service')
var ObjectId = require('mongoose').Types.ObjectId;

// Get list of questions
exports.index = function(req, res) {
  var filterBy = {};
  var skip = null;
  if (req.query.filterBy !== "{}") {
    filterBy = JSON.parse(req.query.filterBy);
  }
  if (req.query.skip > 0) {
    skip = 10 + req.query.skip * 10;
  } else {
    skip = 0;
  }
    switch(req.query.category){
    case 'views':
      Question.find(filterBy).sort({views: -1}).skip(skip).limit(20).exec(function (err, questions){
       if(err) { return handleError(res, err); }
       return res.status(200).json(questions);
      })
      break;
    case 'viewsThisWeek':
    var cutOff = new Date();
    cutOff.setDate(cutOff.getDate()-7)
    filterBy.created = { $gt: cutOff }
      Question.find(filterBy).sort({views: -1}).skip(skip).limit(20).exec(function (err, questions){
       if(err) { return handleError(res, err); }
       return res.status(200).json(questions);
      })
      break;
    case 'viewsThisMonth':
    var c = new Date();
    c.setDate(c.getDate()-30)
    filterBy.created = { $gt: c } 
      Question.find(filterBy).sort({views: -1}).skip(skip).limit(20).exec(function (err, questions){
       if(err) { return handleError(res, err); }
       return res.status(200).json(questions);
      })
      break;
    case 'votes_count':
      Question.find(filterBy).sort('-votes_count').skip(skip).limit(20).exec(function (err, questions){
          if(err) { return handleError(res, err); }
             return res.status(200).json(questions);
      })
      break;
    case 'created':
    Question.find(filterBy).sort('-created').skip(skip).limit(20).exec(function (err, questions){
        if(err) { return handleError(res, err); }
         return res.status(200).json(questions);
    })
      break;
    case 'noAnswer':
      filterBy.answers_count = {'$lt': 5};
      Question.find(filterBy).sort({answers_count:1, created: 1}).skip(skip).limit(20).exec(function (err, questions){
          if(err) { return handleError(res, err); }
            return res.status(200).json(questions);
      })
      break;
    case 'jais':
      Question.find(filterBy).sort('-jais_count').skip(skip).limit(20).exec(function (err, questions){
          if(err) { return handleError(res, err); }
             return res.status(200).json(questions);
      })
      break;
    default:
      Question.find(filterBy).sort({views: -1}).skip(skip).limit(20).exec(function (err, questions){
       if(err) { return handleError(res, err); }
       return res.status(200).json(questions);
      })
  }
};

// Text Search
exports.search = function(req, res) {
  Question.search({ query_string:{query: wordcut.cut(req.query.q) }}, function (err, results) {
    if(err) { return handleError(res, err); }
      return res.status(200).json(results)
  })
};

// Get a single question
exports.show = function(req, res) {
  // console.log(req.connection.remoteAddress);
  Question.findById(req.params.id, function (err, question) {
    if(err) { return handleError(res, err); }
    if(!question) { return res.send(404); }
    res.status(200).json(question);
    var random = Math.floor((Math.random() * 10) + 1);
    if (random <= 8) {
      question.views++;
      question.save();
    }
  });
};

// Creates a new Question in the DB.
exports.create = function(req, res) {
  var newTags = req.body.newTags;
  var newQuestion = req.body.newQuestion;
  function createNewQuestion(nq) {
    Question.create(nq, function(err, question) {
      if(err) { return handleError(res, err); }
        for (var i = 0; i < question.tags.length; i++) {
          Tag.findById(question.tags[i]._id, function (err, t){
              t.questions_count++;
              t.popular_count++;
              t.questions_id.push(question._id);
              t.save(function(err, result){
                // if (err) { return handleError(res, err); }
                // console.log(result);
              })
          })
        }
      User.findById(question.ownerId, function(err, user){
        // if(!user){ return res.send(404)}
        user.questions_id.push(question._id);
        user.questions_count++;
        user.save(function(err,u){
          if (!question.anonymous) {          
            User.find({ '_id':{ $in: u.follower_id }}).select('email username').exec(function(err, usersEmail){
              emailService.sendOnCreateQuestion(usersEmail, question)
            })
          }
        })
      })
      return res.status(200).json(question)
    });
  }

  newQuestion.searchname = wordcut.cut(newQuestion.name);

  if (newTags.length >= 1) {
    var promise = Tag.create(newTags, function(){
      var tagsToJoin = arguments;
      for (var i = 1; i < tagsToJoin.length; i++) {
        newQuestion.tags.push({name: tagsToJoin[i].name, _id: tagsToJoin[i]._id})
      }
    });
    promise.then(function(){
      createNewQuestion(newQuestion)
    })
  } else {
    createNewQuestion(newQuestion)
  }

};

// Increment Vote for Question in the DB.
exports.upVote = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Question.findById(req.params.id, function (err, question) {
    if (err) { return handleError(res, err); }
    if(!question) { return res.send(404); }
    question.upvotes.push(req.body.userId);
    question.votes_count++;
    question.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, question);
    });
  });
};

// Decrement Vote for Question in the DB.
exports.downVote = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Question.findById(req.params.id, function (err, question) {
    if (err) { return handleError(res, err); }
    if(!question) { return res.send(404); }
    question.downvotes.push(req.body.userId);
    question.votes_count--;
    question.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, question);
    });
  });
};

// Increment Jai for Question in the DB.
exports.addJai = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Question.findById(req.params.id, function (err, question) {
    if (err) { return handleError(res, err); }
    if(!question) { return res.send(404); }
    question.jais.push(req.body.userId);
    question.jais_count++;
    question.save(function (err) {
      if (err) { return handleError(res, err); }
       res.status(200).json(question);
       User.findById(req.body.userId, function(err, user){
        console.log(err)
        user.jais_count++;
        user.jais_id.push(question._id);
        user.save();
       })
    });
  });
};

// Updates an existing thing in the DB.
exports.update = function(req, res) {
  var newTags = req.body.newTags;
  var questionToUpdate = req.body.questionToUpdate || req.body;
  if (newTags) {
    var promise = Tag.create(newTags, function(){
      var tagsToJoin = arguments;
      for (var i = 1; i < tagsToJoin.length; i++) {
        questionToUpdate.tags.push({name: tagsToJoin[i].name, _id: tagsToJoin[i]._id})
      }
    });
    promise.then(function(){
      Question.findById(req.params.id, function(err, question){
        if (err) { return handleError(res, err); }
        if(!question) { return res.send(404); }
        question.markModified('tags');
        question.markModified('answers');
        question.markModified('comments');
        var updated = _.merge(question, questionToUpdate);
        updated.save(function (err) {
          if (err) { return handleError(res, err); }
          return res.status(200).json(question);
        })
      })
    })
  } else {
    Question.findById(req.params.id, function(err, question){
      if (err) { return handleError(res, err); }
      if(!question) { return res.send(404); }
      question.markModified('tags');
      question.markModified('answers');
      question.markModified('comments');
      var updated = _.merge(question, questionToUpdate);
      updated.save(function (err) {
        if (err) { return handleError(res, err); }
        return res.status(200).json(question);
      })
    })
  }
};



// Updates an existing thing in the DB.
exports.addAnswer = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Question.findById(req.params.id, function (err, question) {
    if (err) { return handleError(res, err); }
    if(!question) { return res.send(404); }
    question.answers.push(req.body)
    question.answers_count++;
    question.save(function (err) {
      if (err) { return handleError(res, err); }
      User.findById(req.body.user_id, function(err, user){
        if(!user){ return res.send(404)}
        user.ansInQuestions_id.push(question._id)
        user.answers_count++;
        user.save(function(err,u){
          var locals = {
            question: question,
            answerer: user,
            answer: req.body
          };
          emailService.sendEmailOnNewAns(locals)
        })
      })
      res.status(200).send(question)
    });
  });
};

exports.addComment = function(req, res) {
  Question.findById(req.params.id, function(err, question){
    if (err) { return handleError(res, err); }
    if(!question) { return res.send(404); }
    question.comments.push(req.body);
    question.markModified('comments');
    question.save(function (err) {
      if (err) { return handleError(res, err); }
      var locals = {
        question: question,
        newComment: req.body
      }
      emailService.sendOnNewCommentInQuestion(locals)
      res.status(200).json(question);
    })
  })
}

// Updates an existing thing in the DB.
exports.updateQuestionComment = function(req, res) {
    Question.findById(req.params.id, function(err, question){
      if (err) { return handleError(res, err); }
      if(!question) { return res.send(404); }
      question.comments = req.body;
      question.markModified('comments');
      question.save(function (err) {
        if (err) { return handleError(res, err); }
        return res.status(200).json(question);
      })
    })
};

exports.deleteAns = function(req, res) {
  Question.findById(req.params.id, function (err, question) {
    if (err) { return handleError(res, err); }
    if(!question) { return res.send(404); }
    _.remove(question.answers, function(answer){
       return answer.user_id === req.params.user_id
    })
    question.markModified('answers');
    question.answers_count--;
    question.save(function (err) {
      if (err) { return handleError(res, err); }
      res.status(200).json(question);
      User.findById(req.params.user_id, function(err, user){
        // if(!user){ return res.send(404)}
        console.log(err)
        user.ansInQuestions_id.pull(question._id)
        user.answers_count--;
        user.save(function(err,u){
          // console.log(u)
          return;
        })
      })
    });
  });
};

exports.myAns = function(req, res){
  User.findById(req.query.userId, function(err, user){
    Question.find({ '_id':{ $in: user.ansInQuestions_id }}, function(err, questions){
      if (err) { return handleError(res, err); }
      return res.status(200).json(questions)
    })
  })
};

// Update Answers for Question in the DB.
exports.updateAns = function(req, res) {
  Question.findById(req.params.id, function (err, question) {
    if (err) { return handleError(res, err); }
    if(!question) { return res.send(404); }
    question.answers = req.body;
    question.markModified('answers');
    question.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(question);
    });
  });
};

exports.AddCommentToAns = function(req, res) {
  Question.findById(req.params.id, function (err, question) {
    if (err) { return handleError(res, err); }
    if(!question) { return res.send(404); }
    question.answers = req.body;
    question.markModified('answers');
    question.save(function (err) {
      if (err) { return handleError(res, err); }
      res.status(200).json(question);
      var ans = _.where(question.answers, {user_id: req.params.questionId})
      var comment = _.last(ans[0].comments)
      var locals = {
        question: question,
        answer: ans[0],
        newComment: comment
      }
      emailService.sendOnNewCommentInAns(locals)
    });
  });
};

// Add Report for "bad" Question in the DB.
exports.report = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Question.findById(req.params.id, function (err, question) {
    if (err) { return handleError(res, err); }
    if(!question) { return res.send(404); }
    question.reports.push(req.body.userId);
    question.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, question);
    });
  });
};

// Deletes a thing from the DB.
exports.destroy = function(req, res) {
  Question.findById(req.params.id, function (err, question) {
    if(err) { return handleError(res, err); }
    if(!question) { return res.send(404); }
    if(question.ownerId) {
      User.findById(question.ownerId, function(err, user){
        user.questions_id.pull(question._id);
        user.questions_count--;
        user.save();
      })
    }

    Tag.find({ '_id':{ $in:  _.pluck(question.tags, '_id') }}, function(err, tags){
      if (err) { return handleError(res, err); }
      tags.forEach(function(tag){
          Tag.findById(tag._id, function (err, t){
              t.questions_count--;
              t.popular_count--;
              t.questions_id.pull(question._id);
              if (t.questions_id.length <= 0) {
                t.remove();
              } else {
                t.save()
              }
          })
      })
    })
    User.update({'_id':{ $in: _.pluck(question.answers, 'user_id')}}, {$pull: {  ansInQuestions_id: question._id }, $inc: {answers_count: -1} } , { multi: true }, function(err, affected){
      // console.log(affected)
    })
    question.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}