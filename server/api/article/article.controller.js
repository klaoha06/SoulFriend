/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Article = require('./article.model');
var User = require('../user/user.model');
var Tag = require('../tag/tag.model');
var wordcut = require("wordcut");

wordcut.init('./node_modules/wordcut/data/tdict-std.txt');

// Get list of articles
exports.index = function(req, res) {
  var filterBy;
  var skip;
  var sort = req.query.sort;
  if (req.query.filterBy) {
    filterBy = JSON.parse(req.query.filterBy);
  }
  if (req.query.skip > 0) {
    skip = 10 + req.query.skip * 10;
  } else {
    skip = 0;
  }
  switch(req.query.category){
    case 'popular':
      Article.find({},{},{limit:15, sort:{views: 1}},function (err, articles) {
        if(err) { return handleError(res, err); }
        return res.status(200).json(articles);
      });
      break;
    default:
      Article.find(filterBy).sort(sort).skip(skip).limit(20).exec(function (err, articles){
       if(err) { return handleError(res, err); }
       return res.status(200).json(articles);
      })
  }

};

// Text Search
exports.search = function(req, res) {
  Article.search({ query_string:{query: wordcut.cut(req.query.userInput) }}, function (err, results) {
    if(err) { return handleError(res, err); }
      return res.status(200).json(results)
  })
};

// Get a single article
exports.show = function(req, res) {
  Article.findById(req.params.id, function (err, article) {
    if(err) { return handleError(res, err); }
    if(!article) { return res.send(404); }
    res.json(article);
    article.views++;
    article.save();
  });
};

// Creates a new thing in the DB.
exports.create = function(req, res) {
  var newTags = req.body.newTags;
  var newArticle = req.body.newArticle;
  function createNewArticle(na) {
    Article.create(na, function(err, article) {
      if(err) { return handleError(res, err); }
        for (var i = 0; i < article.tags.length; i++) {
          // console.log(article.tags[i])
          Tag.findById(article.tags[i]._id, function (err, t){
              // console.log(t)
              t.articles_count++;
              t.popular_count++;
              t.articles_id.push(article._id);
              t.save(function(err, result){
                if (err) { return handleError(res, err); }
              })
          })
        }
      User.findById(article.ownerId, function(err, user){
        if(!user){ return res.send(404)}
        user.articles_id.push(article._id);
        user.articles_count++;
        user.save()
      })
      return res.status(200).json(article)
    });
  }
  newArticle.searchname = wordcut.cut(newArticle.name);
  if (newTags.length >= 1) {
    var promise = Tag.create(newTags, function(){
      var tagsToJoin = arguments;
      for (var i = 1; i < tagsToJoin.length; i++) {
        newArticle.tags.push({name: tagsToJoin[i].name, _id: tagsToJoin[i]._id})
      }
    });
    promise.then(function(){
      createNewArticle(newArticle)
    })
  } else {
    createNewArticle(newArticle)
  }

};

// Updates an existing article in the DB.
exports.update = function(req, res) {
  var newTags = req.body.newTags;
  var articleToUpdate = req.body;
  if (newTags) {
    var promise = Tag.create(newTags, function(){
      var tagsToJoin = arguments;
      for (var i = 1; i < tagsToJoin.length; i++) {
        articleToUpdate.tags.push({name: tagsToJoin[i].name, _id: tagsToJoin[i]._id})
      }
    });
    promise.then(function(){
      Article.findByIdAndUpdate(articleToUpdate._id, articleToUpdate, function(err, article){
        if (err) { return handleError(res, err); }
        return res.status(200).send(article)
      })
    })
  } else {
    Article.findByIdAndUpdate(articleToUpdate._id, articleToUpdate, function(err ,article){
      if (err) { return handleError(res, err); }
      return res.status(200).send(article)
    })
  }
};
// exports.update = function(req, res) {
//   if(req.body._id) { delete req.body._id; }
//   Article.findById(req.params.id, function (err, article) {
//     if (err) { return handleError(res, err); }
//     if(!article) { return res.send(404); }
//     article.markModified('comments');
//     var updated = _.merge(article, req.body);
//     updated.save(function (err) {
//       if (err) { return handleError(res, err); }
//       return res.json(200, article);
//     });
//   });
// };

// // Update Comments for Question in the DB.
// exports.updateAns = function(req, res) {
//   Question.findById(req.params.id, function (err, question) {
//     if (err) { return handleError(res, err); }
//     if(!question) { return res.send(404); }
//     question.markModified('comments');
//     question.save(function (err) {
//       if (err) { return handleError(res, err); }
//       return res.json(200, question);
//     });
//   });
// };

// Increment Vote for Article in the DB.
exports.upVote = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Article.findById(req.params.id, function (err, article) {
    if (err) { return handleError(res, err); }
    if(!article) { return res.send(404); }
    article.upvotes.push(req.body.userId);
    article.votes_count++;
    article.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, article);
    });
  });
};

// Decrement Vote for Article in the DB.
exports.downVote = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Article.findById(req.params.id, function (err, article) {
    if (err) { return handleError(res, err); }
    if(!article) { return res.send(404); }
    article.downvotes.push(req.body.userId);
    article.votes_count--;
    article.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, article);
    });
  });
};


// Add Comment.
exports.addComment = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Article.findById(req.params.id, function (err, article) {
    if (err) { return handleError(res, err); }
    if(!article) { return res.send(404); }
    article.comments.push(req.body);
    article.comments_count++;
    article.save(function (err) {
      if (err) { return handleError(res, err); }
      res.status(200).json(article);
      User.findById(req.body.user._id, function(err, user){
      if (user) {        
        user.comments_count++;
        user.commentInArticles_id.push(article._id);
        user.save();
      }
      })
    });
  });
};

// Update Comments for Article in the DB.
exports.updateComment = function(req, res) {
  Article.findById(req.params.id, function (err, article) {
    if (err) { return handleError(res, err); }
    if(!article) { return res.send(404); }
    article.markModified('comments');
    article.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, article);
    });
  });
};

// Add Report for "bad" Article in the DB.
exports.report = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Article.findById(req.params.id, function (err, article) {
    if (err) { return handleError(res, err); }
    if(!article) { return res.send(404); }
    article.reports.push(req.body.userId);
    article.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, article);
    });
  });
};

// Deletes a thing from the DB.
exports.destroy = function(req, res) {
  Article.findById(req.params.id, function (err, article) {
    if(err) { return handleError(res, err); }
    if(!article) { return res.send(404); }
    if(article.ownerId) {
      User.findById(article.ownerId, function(err, user){
        user.articles_id.pull(article._id);
        user.articles_count--;
        user.save();
      })
    }
    article.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};


function handleError(res, err) {
  return res.send(500, err);
}