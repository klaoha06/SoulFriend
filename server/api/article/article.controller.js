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
var Article = require('./article.model');

// Get list of articles
exports.index = function(req, res) {
  // console.log(req.query.catagory)
  switch(req.query.category){
    case 'popular':
      Article.find({},{},{limit:15, sort:{views: 1}},function (err, articles) {
        if(err) { return handleError(res, err); }
        return res.status(200).json(articles);
      });
      break;
    case 'newest':
      Article.find({},{},{limit:30, sort:{created: -1, views: 1}},function (err, articles) {
        if(err) { return handleError(res, err); }
        return res.status(200).json(articles);
      });
      break;
    default:
      Article.find({},{},{limit: 30, sort:{views: 1}},function (err, articles) {
        if(err) { return handleError(res, err); }
        return res.status(200).json(articles);
      });
  }

};

// Get a single article
exports.show = function(req, res) {
  Article.findById(req.params.id, function (err, article) {
    if(err) { return handleError(res, err); }
    if(!article) { return res.send(404); }
    return res.status(200).json(article);
  });
};

// Creates a new thing in the DB.
exports.create = function(req, res) {
  Article.create(req.body, function(err, article) {
    if(err) { return handleError(res, err); }
    return res.json(201, article);
  });
};

// Updates an existing thing in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Article.findById(req.params.id, function (err, article) {
    if (err) { return handleError(res, err); }
    if(!article) { return res.send(404); }
    var updated = _.merge(article, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, article);
    });
  });
};

// Add Comment.
exports.addComment = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Article.findById(req.params.id, function (err, article) {
    if (err) { return handleError(res, err); }
    if(!article) { return res.send(404); }
    article.comments.push(req.body);
    article.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, article);
    });
  });
};

// Deletes a thing from the DB.
exports.destroy = function(req, res) {
  Article.findById(req.params.id, function (err, article) {
    if(err) { return handleError(res, err); }
    if(!article) { return res.send(404); }
    article.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};


function handleError(res, err) {
  return res.send(500, err);
}