'use strict';

var promise = require('bluebird');
var timeStamps = require('mongoose-times');
var elmongo = require('elmongo');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TagSchema = new Schema({
  name: { type: String, autocomplete: true },
  info: String,
  questions_id: Array,
  questions_count: { type: Number, default: 0},
  articles_id: Array,
  articles_count: { type: Number, default: 0},
  popular_count: { type: Number, default: 0},
  views_count: { type: Number, default: 0}
});

TagSchema.plugin(timeStamps);
TagSchema.plugin(elmongo);


var Tag = mongoose.model('Tag', TagSchema);

Tag.sync(function (err, numSynced) {
  console.log('number of tags synced:', numSynced)
})

promise.promisifyAll(Tag);
promise.promisifyAll(Tag.prototype);

module.exports = Tag;