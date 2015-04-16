'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    timeStamps = require('mongoose-times');

var ReportSchema = new Schema({
  name: String,
  content: String,
  upvotes: Array,
  votes_count: { type: Number, default: 0},
  downvotes: Array,
	ownerId: { type: Schema.Types.ObjectId, ref: 'User' },
  owner: {
  	username: String,
  	role: String,
    coverimg: String
  },
});

ReportSchema.plugin(timeStamps);

module.exports = mongoose.model('Report', ReportSchema);