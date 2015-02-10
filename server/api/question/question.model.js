'use strict';

var promise = require('bluebird');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var timeStamps = require('mongoose-times');

var QuestionSchema = new Schema({
  owner: {
  	_ownerId: { type: Schema.Types.ObjectId },
  	username: String,
  	role: String
  },
  name: String,
  body: String,
  coverImg: String,
  votes: { type: Number, default: 0},
  views: { type: Number, default: 0},
  answered: { type: Boolean, default: false},
  answers: Array,
  tag_ids: Array, 
});

QuestionSchema.plugin(timeStamps);

var Question = mongoose.model('Question', QuestionSchema);

promise.promisifyAll(Question);
promise.promisifyAll(Question.prototype);

module.exports = Question;