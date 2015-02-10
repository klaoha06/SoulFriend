'use strict';
var promise = require('bluebird');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ThingSchema = new Schema({
  name: String,
  info: String,
  active: Boolean
});

var Thing = mongoose.model('Thing', ThingSchema);

promise.promisifyAll(Thing);
promise.promisifyAll(Thing.prototype);

exports.Thing = Thing;