'use strict';

var _server = require('./server/');

var server = _interopRequireWildcard(_server);

var _producer = require('./producer/');

var producer = _interopRequireWildcard(_producer);

var _consumer = require('./consumer/');

var consumer = _interopRequireWildcard(_consumer);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

module.exports = {
    server: server.execute,
    producer: producer.execute,
    consumer: consumer.execute
};