'use strict';

var promise = require('bluebird');
var mongoose = require('mongoose');
var elmongo = require('elmongo');
var Schema = mongoose.Schema;
var timeStamps = require('mongoose-times');

var QuestionSchema = new Schema({
  owner: {
  	_ownerId: { type: Schema.Types.ObjectId },
  	username: String,
  	role: String,
    coverimg: String
  },
  searchname: { type: Array, autocomplete: true },
  name: String,
  body: String,
  jais: Array,
  jais_count: { type: Number, default: 0},
  upvotes: Array,
  votes_count: { type: Number, default: 0},
  downvotes: Array,
  views: { type: Number, default: 0},
  shares: { type: Number, default: 0},
  answered: { type: Boolean, default: false},
  likedAns: { type: Number, default: 0},
  answers: Array,
  answers_count: { type: Number, default: 0},
  tags: Array,
  topic: String
});


QuestionSchema.plugin(timeStamps);
QuestionSchema.plugin(elmongo);


// QuestionSchema.index({name: 'text'})
  
var Question = mongoose.model('Question', QuestionSchema)


Question.sync(function (err, numSynced) {
  // console.log('number of cats synced:', numSynced)
})

promise.promisifyAll(Question);
promise.promisifyAll(Question.prototype);

module.exports = Question;