'use strict';

var express = require('express');
var controller = require('./question.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.get('/search', controller.search);
router.get('/myanswers', controller.myAns);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.put('/:id/newanswer', controller.addAnswer);
router.patch('/:id/answers', controller.updateAns);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

router.post('/:id/downvote', auth.isAuthenticated(), controller.downVote);
router.post('/:id/upvote', auth.isAuthenticated(), controller.upVote);

router.post('/:id/addjai', auth.isAuthenticated(), controller.addJai);

module.exports = router;