'use strict';

var promise = require('bluebird');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var timeStamps = require('mongoose-times');
var mongoosastic = require('mongoosastic');

var ArticleSchema = new Schema({
  ownerId: { type: Schema.Types.ObjectId, ref: 'User' },
  owner: {
  	username: String,
    summary: String,
  	role: String,
    coverimg: String
  },
  name: { type: String, es_indexed:true },
  searchname: { type: Array, es_indexed:true },
  importance: String,
  summary: String,
  body: String,
  inHouse: { type: Boolean, default: false},
  coverImg: String,
  upvotes: Array,
  downvotes: Array,
  votes_count: { type: Number, default: 0, es_indexed:true},
  views: { type: Number, default: 0},
  shares: { type: Number, default: 0},
  comments: Array,
  comments_count: { type: Number, default: 0},
  tags: Array,
  topic: String,
  reports: Array
});

ArticleSchema.plugin(timeStamps);
ArticleSchema.plugin(mongoosastic);

var Article = mongoose.model('Article', ArticleSchema);

Article.synchronize();

promise.promisifyAll(Article);
promise.promisifyAll(Article.prototype);

module.exports = Article;