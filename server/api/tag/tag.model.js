'use strict';

var promise = require('bluebird');
var timeStamps = require('mongoose-times');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TagSchema = new Schema({
  name: String,
  info: String,
  questions_id: Array,
  articles_id: Array,
  votes: { type: Number, default: 0},
  views: { type: Number, default: 0}
});

TagSchema.plugin(timeStamps);

var Tag = mongoose.model('Tag', TagSchema);

promise.promisifyAll(Tag);
promise.promisifyAll(Tag.prototype);

module.exports = Tag;