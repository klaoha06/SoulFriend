'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    timeStamps = require('mongoose-times');

var SuggestionSchema = new Schema({
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

SuggestionSchema.plugin(timeStamps);

module.exports = mongoose.model('Suggestion', SuggestionSchema);