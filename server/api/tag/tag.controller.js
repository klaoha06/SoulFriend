/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /tags              ->  index
 * POST    /tags              ->  create
 * GET     /tags/:id          ->  show
 * PUT     /tags/:id          ->  update
 * DELETE  /tags/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Tag = require('./tag.model');
var Question = require('../question/question.model');

// Get list of tags
exports.index = function(req, res) {
  var order = req.body.orderBy;
  Tag.find().sort(order).limit(20).exec(function(err, results){
      if(err) { return handleError(res, err); }
        return res.status(200).json(results)
  })
};

// Text Search
exports.search = function(req, res) {
  var q = req.query.q.toLowerCase();
  Tag.find({'name': {'$regex': q}}).sort('popular_count').limit(5).select('name').exec(function(err, results){
      if(err) { return handleError(res, err); }
        return res.status(200).json(results)
  })
};

// Get a single tag
exports.show = function(req, res) {
  Tag.findById(req.params.id, function (err, tag) {
    if(err) { return handleError(res, err); }
    if(!tag) { return res.send(404); }
    return res.json(tag);
  });
};

// Get Questions by Tag's Id
exports.tagQuestions = function(req, res) {
  var query = req.query.questions;
  var skip = req.query.skip;
  if (typeof req.query.questions === 'string') {
    query = [req.query.questions];
  }
  Question.find({ '_id':{ $in: query }}).sort().skip(skip).limit(20).exec(function(err, questions){
    if (err) { return handleError(res, err); }
    return res.status(200).json(questions)
  })
};

// Creates a new tag in the DB.
exports.create = function(req, res) {
  Tag.create(req.body, function(err, tag) {
    if(err) { return handleError(res, err); }
    return res.json(201, tag);
  });
};

// Updates an existing tag in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Tag.findById(req.params.id, function (err, tag) {
    if (err) { return handleError(res, err); }
    if(!tag) { return res.send(404); }
    var updated = _.merge(tag, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, tag);
    });
  });
};

// Deletes a tag from the DB.
exports.destroy = function(req, res) {
  Tag.findById(req.params.id, function (err, tag) {
    if(err) { return handleError(res, err); }
    if(!tag) { return res.send(404); }
    tag.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}