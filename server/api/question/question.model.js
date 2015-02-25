'use strict';

// var promise = require('bluebird');
var mongoose = require('mongoose');
// var elmongo = require('elmongo');
var mongoosastic = require('mongoosastic');
var Schema = mongoose.Schema;
var timeStamps = require('mongoose-times');

var QuestionSchema = new Schema({
  owner: {
  	_ownerId: { type: Schema.Types.ObjectId },
  	username: String,
  	role: String,
    coverimg: String,
    summary: String
  },
  name: {type:String, es_indexed:true},
  body: String,
  coverImg: String,
  jais: { type: Number, default: 0},
  votes: { type: Number, default: 0},
  views: { type: Number, default: 0},
  shares: { type: Number, default: 0},
  answered: { type: Boolean, default: false},
  answers: Array,
  tags: Array, 
});


QuestionSchema.plugin(timeStamps);
// QuestionSchema.plugin(elmongo);
QuestionSchema.plugin(mongoosastic);

// QuestionSchema.index(
// {
//                 settings:{
//                     analysis:{
//                       analyzer:{
//                         default:{
//                           type:"custom",
//                           tokenizer:"standard",
//                           filters:[ "standard","thai","lowercase", "stop", "kstem" ]
//                       }
//                   }
//               },
//               filter: {
//                   thai: {
//                     type: "org.apache.lucene.analysis.th.ThaiWordFilterFactory"
//                 }
//             }
//         }
//     }
// )

// QuestionSchema.plugin(searchPlugin, {
//   fields: ['name', 'tags']
// })

// QuestionSchema.plugin(textSearch);
// QuestionSchema.index({name: 'text', tags: 'text'});

QuestionSchema.index({name: 'text'})
  
var Question = mongoose.model('Question', QuestionSchema)


// , stream = Question.synchronize()
// ,counter = 0;

//   Question.sync(function (err, numSynced) {
//   console.log('number of cats synced:', numSynced)
// })

// Question.createMapping({
//   "analysis":{
//       "analyzer":{
//         "default":{
//           "type":"custom",
//           "tokenizer":"standard",
//           "filters":[ "standard","thai","lowercase", "stop", "kstem" ]
//         }
//       }
//     },
//     "filter": {
//       "thai": {
//         "type": "org.apache.lucene.analysis.th.ThaiWordFilterFactory"
//       }
//     }
// },function(err, mapping){
//   // do neat things here
// });

// promise.promisifyAll(Question);
// promise.promisifyAll(Question.prototype);

module.exports = Question;