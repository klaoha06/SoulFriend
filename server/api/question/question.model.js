'use strict';

var promise = require('bluebird');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var timeStamps = require('mongoose-times');
var mongoosastic = require('mongoosastic');

var QuestionSchema = new Schema({
	ownerId: { type: Schema.Types.ObjectId, ref: 'User' },
  owner: {
  	username: String,
  	role: String,
    coverimg: String
  },
  comments: Array,
  searchname: { type: Array, es_indexed:true },
  name: { type: String, es_indexed:true },
  body: String,
  jais: Array,
  jais_count: { type: Number, default: 0},
  upvotes: Array,
  votes_count: { type: Number, default: 0},
  downvotes: Array,
  views: { type: Number, default: 0},
  shares: { type: Number, default: 0},
  answered: { type: Boolean, default: false},
  likedAns: { type: Number, default: 0, es_indexed: true},
  answers: Array,
  answers_count: { type: Number, default: 0, es_indexed: true},
  popularity: { type: Number, default: 0},
  tags: Array,
  topic: String,
  reports: Array
});

QuestionSchema.plugin(timeStamps);
QuestionSchema.plugin(mongoosastic)

var Question = mongoose.model('Question', QuestionSchema)

Question.synchronize();

promise.promisifyAll(Question);
promise.promisifyAll(Question.prototype);

module.exports = Question;