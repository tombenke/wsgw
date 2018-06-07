#!/usr/bin/env node

/*jshint node: true */
'use strict';

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _datafile = require('datafile');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The startup function of the adapter
 *
 * This function should be registered with the startup phase, then npac will call when the project is starting.
 *
 * @arg {Object} container  - The actual state of the container this adapter will be added
 * @arg {Function} next     - Error-first callback function to pass the result partial container extended with the wss adapter.
 *
 * see also: the `npac.startup` process description.
 *
 * @function
 */
var startup = function startup(container, next) {
    // Merges the defaults with the config coming from the outer world
    var serviceConfig = _lodash2.default.merge({}, _config2.default, { service: container.config.service || {} });
    container.logger.info('Start up service adapter');

    var httpServer = _http2.default.createServer();
    var io = (0, _socket2.default)(httpServer);
    httpServer.listen(8001);

    io.on('connection', function (socket) {
        console.log('Client connected');
        socket.on('message', function (data) {
            console.log(data);
            socket.broadcast.volatile.emit(data.topic, data);
        });
    });

    // Call next setup function with the context extension
    next(null, {
        config: serviceConfig,
        wss: {
            server: io
        }
    });
};

/**
 * The shutdown function of the service adapter
 *
 * This function should be registered with the shutdown phase, then npac will call when graceful shutdown happens.
 *
 * @arg {Object} container  - The actual state of the container this adapter is running
 * @arg {Function} next     - Error-first callback function to pass the result partial container extended with the wss adapter.
 *
 * see also: the `npac.startup` process description.
 *
 * @function
 */
var shutdown = function shutdown(container, next) {
    container.logger.info("Shut down wss adapter");
    container.wss.server.close(next(null, null));
    //    next(null, null)
};

module.exports = {
    defaults: _config2.default,
    startup: startup,
    shutdown: shutdown
};