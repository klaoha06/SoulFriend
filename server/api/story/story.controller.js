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
var Book = require('./story.model');

// Get list of things
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
  switch(req.query.category){
    case 'popular':
      Book.find({},{},{limit:15, sort:{views: 1}},function (err, books) {
        if(err) { return handleError(res, err); }
        return res.status(200).json(books);
      });
      break;
    default:
      Book.find(filterBy).sort(sort).skip(skip).limit(20).exec(function (err, books){
       if(err) { return handleError(res, err); }
       return res.status(200).json(books);
      })
  }
};

// Get a single thing
exports.show = function(req, res) {
  Thing.findById(req.params.id, function (err, thing) {
    if(err) { return handleError(res, err); }
    if(!thing) { return res.send(404); }
    return res.json(thing);
  });
};

// Creates a new thing in the DB.
exports.create = function(req, res) {
  Thing.create(req.body, function(err, thing) {
    if(err) { return handleError(res, err); }
    return res.json(201, thing);
  });
};

// Updates an existing thing in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Thing.findById(req.params.id, function (err, thing) {
    if (err) { return handleError(res, err); }
    if(!thing) { return res.send(404); }
    var updated = _.merge(thing, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, thing);
    });
  });
};

// Deletes a thing from the DB.
exports.destroy = function(req, res) {
  Thing.findById(req.params.id, function (err, thing) {
    if(err) { return handleError(res, err); }
    if(!thing) { return res.send(404); }
    thing.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}