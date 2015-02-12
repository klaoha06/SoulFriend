'use strict';

var promise = require('bluebird');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var timeStamps = require('mongoose-times');

var ArticleSchema = new Schema({
  owner: {
  	_ownerId: { type: Schema.Types.ObjectId },
  	username: String,
    summary: String,
  	role: String
  },
  name: String,
  importance: String,
  summary: String,
  body: String,
  inHouse: { type: Boolean, default: false},
  coverImg: String,
  votes: { type: Number, default: 0},
  views: { type: Number, default: 0},
  comments: Array,
  tag_ids: Array,
});

ArticleSchema.plugin(timeStamps);

var Article = mongoose.model('Article', ArticleSchema);

promise.promisifyAll(Article);
promise.promisifyAll(Article.prototype);

module.exports = Article;