/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /suggestions              ->  index
 * POST    /suggestions              ->  create
 * GET     /suggestions/:id          ->  show
 * PUT     /suggestions/:id          ->  update
 * DELETE  /suggestions/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Suggestion = require('./suggestion.model');

// Get list of suggestions
exports.index = function(req, res) {
  var filterBy;
  var skip;
  var sort = req.query.sort;
  if (req.query.filterBy) {
    filterBy = JSON.parse(req.query.filterBy);
  }
  if (req.query.skip > 0) {
    skip = 10 + req.query.skip * 10;
  } else {
    skip = 0;
  }
  console.log(skip)
  Suggestion.find(filterBy).sort(sort).skip(skip).limit(20).exec(function (err, suggestions){
   if(err) { return handleError(res, err); }
   return res.status(200).json(suggestions);
  })
};

// Get a single suggestion
exports.show = function(req, res) {
  Suggestion.findById(req.params.id, function (err, suggestion) {
    if(err) { return handleError(res, err); }
    if(!suggestion) { return res.send(404); }
    return res.json(suggestion);
  });
};

// Creates a new suggestion in the DB.
exports.create = function(req, res) {
  Suggestion.create(req.body, function(err, suggestion) {
    if(err) { return handleError(res, err); }
    return res.json(201, suggestion);
  });
};

// Updates an existing suggestion in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Suggestion.findByIdAndUpdate(req.params.id, req.body, function (err, suggestion) {
    if (err) { return handleError(res, err); }
    if(!suggestion) { return res.send(404); }
      return res.status(200).json(suggestion);
  });
};

// Deletes a suggestion from the DB.
exports.destroy = function(req, res) {
  Suggestion.findById(req.params.id, function (err, suggestion) {
    if(err) { return handleError(res, err); }
    if(!suggestion) { return res.send(404); }
    suggestion.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}