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
var Tag = require('../tag/tag.model');
var wordcut = require("wordcut");

wordcut.init('./node_modules/wordcut/data/tdict-std.txt');

// Get list of questions
exports.index = function(req, res) {
  var topic = null;
  if (req.query.topic) {
    topic = {topic: req.query.topic}
  } else {
    topic = {};
  }
  switch(req.query.category){
    case 'views':
      Question.find(topic).sort({views: -1}).limit(20).exec(function (err, questions){
       if(err) { return handleError(res, err); }
       return res.status(200).json(questions);
      })
      break;
    case 'votes_count':
      Question.find(topic).sort('-votes_count').limit(20).exec(function (err, questions){
          if(err) { return handleError(res, err); }
             return res.status(200).json(questions);
      })
      break;
    case 'created':
    Question.find(topic).sort('-created').limit(20).exec(function (err, questions){
        if(err) { return handleError(res, err); }
         return res.status(200).json(questions);
    })
      break;
    case 'noAnswer':
      topic.answers_count = 0;
      Question.find(topic).sort('created').limit(20).exec(function (err, questions){
          if(err) { return handleError(res, err); }
            return res.status(200).json(questions);
      })
      break;
    case 'jais':
      Question.find(topic).sort('-jais_count').limit(20).exec(function (err, questions){
          if(err) { return handleError(res, err); }
             return res.status(200).json(questions);
      })
      break;
    default:
      Question.find(topic).sort({views: -1}).limit(20).exec(function (err, questions){
       if(err) { return handleError(res, err); }
       return res.status(200).json(questions);
      })
  }
};

// Text Search
exports.search = function(req, res) {
  Question.search({ query: wordcut.cut(req.query.userInput), fuzziness: 0.5, fields: ['searchname'], pageSize: 10 }, function (err, results) {
    if(err) { return handleError(res, err); }
      return res.status(200).json(results)
  })
};

// Get a single question
exports.show = function(req, res) {
  Question.findById(req.params.id, function (err, question) {
    if(err) { return handleError(res, err); }
    if(!question) { return res.send(404); }
    return res.json(question);
  });
};

// Creates a new Question in the DB.
exports.create = function(req, res) {
  Question.sync(function (err, numSynced) {
    // console.log('number of cats synced:', numSynced)
  })
  var newTags = req.body.newTags;
  var newQuestion = req.body.newQuestion;
  if (newTags.length >= 1) {
    var promise = Tag.create(newTags, function(){
      var tagsToJoin = arguments;
      for (var i = 1; i < tagsToJoin.length; i++) {
        newQuestion.tags.push({name: tagsToJoin[i].name, _id: tagsToJoin[i]._id})
      }
    });
    promise.then(function(){
      Question.create(newQuestion, function(err, question) {
        if(err) { return handleError(res, err); }
        return res.status(200).json(question)
      });
    })
  } else {
    Question.create(newQuestion, function(err, question) {
      if(err) { return handleError(res, err); }
      return res.status(200).json(question)
    });
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
      return res.json(200, question);
    });
  });
};

// Updates an existing thing in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Question.findById(req.params.id, function (err, question) {
    if (err) { return handleError(res, err); }
    if(!question) { return res.send(404); }
    var updated = _.merge(question, req.body);
    updated.markModified('answers');
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, question);
    });
  });
};

// Updates an existing thing in the DB.
exports.addAnswer = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Question.findById(req.params.id, function (err, question) {
    if (err) { return handleError(res, err); }
    if(!question) { return res.send(404); }
    console.log(req.body)
    question.answers.push(req.body)
    question.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, question);
    });
  });
};

// Decrement Vote for Question in the DB.
exports.updateAns = function(req, res) {
  Question.findById(req.params.id, function (err, question) {
    if (err) { return handleError(res, err); }
    if(!question) { return res.send(404); }

      question.markModified('answers');
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
    question.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}