'use strict';

var promise = require('bluebird');
var timeStamps = require('mongoose-times');
// var findOrCreate = require('mongoose-findorcreate')
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TagSchema = new Schema({
  name: { type: String, autocomplete: true},
  info: String,
  questions_id: [{type: Schema.Types.ObjectId, ref: 'Question'}],
  questions_count: { type: Number, default: 0},
  articles_id: [{type: Schema.Types.ObjectId, ref: 'Article'}],
  articles_count: { type: Number, default: 0},
  popular_count: { type: Number, default: 0},
  views_count: { type: Number, default: 0}
});

TagSchema.plugin(timeStamps);
// TagSchema.plugin(findOrCreate);

var Tag = mongoose.model('Tag', TagSchema);

promise.promisifyAll(Tag);
promise.promisifyAll(Tag.prototype);

module.exports = Tag;