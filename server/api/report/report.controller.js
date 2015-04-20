/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /reports              ->  index
 * POST    /reports              ->  create
 * GET     /reports/:id          ->  show
 * PUT     /reports/:id          ->  update
 * DELETE  /reports/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Report = require('./report.model');

// Get list of reports
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
  Report.find(filterBy).sort(sort).skip(skip).limit(20).exec(function (err, reports){
   if(err) { return handleError(res, err); }
   return res.status(200).json(reports);
  })
};

// Get a single report
exports.show = function(req, res) {
  Report.findById(req.params.id, function (err, report) {
    if(err) { return handleError(res, err); }
    if(!report) { return res.send(404); }
    return res.json(report);
  });
};

// Creates a new report in the DB.
exports.create = function(req, res) {
  Report.create(req.body, function(err, report) {
    if(err) { return handleError(res, err); }
    return res.json(201, report);
  });
};

// Updates an existing report in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Report.findByIdAndUpdate(req.params.id, req.body, function (err, report) {
    if (err) { return handleError(res, err); }
    if(!report) { return res.send(404); }
      return res.status(200).json(report);
  });
};

// Deletes a report from the DB.
exports.destroy = function(req, res) {
  Report.findById(req.params.id, function (err, report) {
    if(err) { return handleError(res, err); }
    if(!report) { return res.send(404); }
    report.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}