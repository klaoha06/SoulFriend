/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var Promise = require('bluebird');
var _ = require('lodash');
Promise.promisifyAll(_);
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
      return res.json(200, results)
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

// Creates a new thing in the DB.
exports.create = function(req, res) {
  var incomingQuestion = req.body.newQuestion;
  var incomingTags = req.body.newTags;
  // console.log(incomingQuestion)
  // console.log(incomingTags)
  var promise = Tag.create(incomingTags);
  promise.then(function(){
    var newTags = arguments;
    
    // Question.create(req.body, function(err, thing) {
    //   if(err) { return handleError(res, err); }
    //   return res.json(201, thing);
    // });


  })
  // var join = Promise.join;
  // var notCreatedTags;
  // _(incomingTags).forEach(function(tag){
  //   if (!_.has(tag, '_id')) {
  //     notCreatedTags.push(tag)
  //   }
  // })

  // var tags = req.body.tags
  // var promisifiedMap = Promise.promisify(_.map)
  // promisifiedMap(req.body.tags, function(tag){
  //             if (!_.has(tag, '_id')) {
  //                Tag.create({name: tag.name}, function(err, newTag){
  //                   // console.log(newTag);
  //                   tag = newTag;
  //                   return {name: newTag.name, _id: newTag._id}
  //                });
  //             }
  //             return tag;
  // }).then(function(result){
  //   console.log(result)
  //   console.log('hi')
  // })
};
//   var question = new Question(req.body);
//   question.searchname = wordcut.cut(question.name);
//   // question.tags = _.map(question.tags, function(tag){
//   //     if (!_.has(tag, '_id')) {
//   //       var tagId;
//   //        Tag.create({name: tag.name}, function(err, newTag){
//   //           tagId = newTag._id
//   //           console.log(newTag);
//   //           return {'name': newTag.name, '_id': tagId}
//   //        });
//   //     }
//   //     return tag;
//   //   })
//   var promisifiedMap = Promise.promisify(_.map)
  // function generateTags(){
  //   return new Promise(function(resolve){
  //     tags = _.map(question.tags, function(tag){
  //                 if (!_.has(tag, '_id')) {
  //                    Tag.create({name: tag.name}, function(err, newTag){
  //                       console.log(newTag);
  //                       tag = newTag;
  //                       return {name: newTag.name, _id: newTag._id}
  //                    });
  //                 }
  //                 return tag;
  //               })
  //       resolve()
  //   })
  // }
//   // question.tags = _.map(question.tags, function(tag){
//   //             if (!_.has(tag, '_id')) {
//   //                Tag.create({name: tag.name}, function(err, newTag){
//   //                   console.log(newTag);
//   //                   return {'name': newTag.name, '_id': newTag._id}
//   //                });
//   //             }
//   //             return tag;
//   //           })
//   generateTags().then(function(){
//     // console.log(question)
//     question.save(function(err, question) {
//     // console.log(question)
//     if(err) { return handleError(res, err); }
//     return res.status(201).json(question)
//   });
//   })
// };

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