/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var report = require('./report.model');

exports.register = function(socket) {
  report.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  report.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('report:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('report:remove', doc);
}