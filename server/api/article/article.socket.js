/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var article = require('./article.model');

exports.register = function(socket) {
  article.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  article.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('article:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('article:remove', doc);
}