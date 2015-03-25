'use strict';

var express = require('express');
var controller = require('./tag.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/search', controller.search);
router.get('/:id/questions', controller.tagQuestions);
router.get('/:id/articles', controller.tagArticles);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;