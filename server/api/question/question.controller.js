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
// var thaiWords = require('./thai-words')
// var fs =require('fs');
var wordcut = require("wordcut");

wordcut.init();


// Get list of questions
exports.index = function(req, res) {
  Question.find({},{},{ skip:10, limit: 9},function (err, questions) {
    if(err) { return handleError(res, err); }
    return res.json(200, questions);
  });
};

// Text Search
exports.search = function(req, res) {
//   Question.sync(function (err, numSynced) {
//   console.log('number of cats synced:', numSynced)
// })
  console.log(req.query.userInput);
  console.log(wordcut.cut(req.query.userInput));
  var queryArray = wordcut.cut(req.query.userInput).split('|')
  // Question.search({ query: req.query.userInput, fields: ['name'] }, function (err, results) {
  //        if(err) { return handleError(res, err); }
  //             return res.json(200, results)
  // })
// Question.createMapping({
//   "mappings": {
//     "question": {
//       "properties": {
//         "name": {
//           "type":     "string",
//           "analyzer": "thai" 
//         }
//       }
//     }
//   }
// },function(err, mapping){
//   console.log(mapping)
//   // do neat things here
  Question.search({ query_string: { query: wordcut.cut(req.query.userInput)}}, function (err, results) {
         if(err) { return handleError(res, err); }
              return res.json(200, results.hits.hits)
  })
// });


  // console.log(req.query.userInput);
  // var input = req.query.userInput.replace(/\s/g, '')
  // console.log(input)
  // Question.search(input, {name:1}, {
  //   limit:10
  // }, function(err, result){
  //    if(err) { return handleError(res, err); }
  //         return res.json(200, result)
  // })
  // Question.textSearch(req.query.userInput, function(err,result){
  //   if(err) { return handleError(res, err); }
  //   return res.json(200, result.results)
  // })
// var query = new RegExp(req.query.userInput, 'i');
// console.log(query)
//   Question.find({name: query}, function(err,result){
//       if(err) { return handleError(res, err); }
//       return res.json(200, result)
//   })

// Question.db.db.executeDbCommand( "text", { search : req.query.userInput }, function(err, results){
//   if(err) { return handleError(res, err); }
//      return res.json(200, results)
// } );
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
  Question.create(req.body, function(err, question) {
    if(err) { return handleError(res, err); }
    return res.json(201, question);
  });
};

// Increment Vote for Question in the DB.
exports.addVote = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Question.findById(req.params.id, function (err, question) {
    if (err) { return handleError(res, err); }
    if(!question) { return res.send(404); }
    question.votes++;
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
    question.jais++;
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
    updated.save(function (err) {
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