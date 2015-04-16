/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var suggestion = require('./suggestion.model');

exports.register = function(socket) {
  suggestion.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  suggestion.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('suggestion:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('suggestion:remove', doc);
}