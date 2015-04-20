'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    timeStamps = require('mongoose-times'),
    mongoosastic = require('mongoosastic')

var StorySchema = new Schema({
	articles_id: [{type: Schema.Types.ObjectId, ref: 'Article'}],
	articles_count: Number,
	name: String,
	searchname: { type: Array, es_indexed:true },
	about: String,
	views: { type: Number, default: 0},
	shares: { type: Number, default: 0},
	writerId: { type: Schema.Types.ObjectId, ref: 'User' },
  owner: {
  	username: String,
  	role: String,
    coverimg: String
  },
  upvotes: Array,
  votes_count: { type: Number, default: 0},
  downvotes: Array,
  reports: Array,
  tags: Array,
  topic: String,
  language: String,
  
});

StorySchema.plugin(timeStamps);
StorySchema.plugin(mongoosastic)

var Story = mongoose.model('Story', StorySchema)

Story.synchronize();

module.exports = Story;