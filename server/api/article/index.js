'use strict';

var express = require('express');
var controller = require('./article.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.get('/search', controller.search);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

router.post('/:id/comments', controller.addComment);
router.patch('/:id/comments', controller.updateComment);
router.post('/:id/downvote', auth.isAuthenticated(), controller.downVote);
router.post('/:id/upvote', auth.isAuthenticated(), controller.upVote);
router.post('/:id/report', auth.isAuthenticated(), controller.report);

module.exports = router;