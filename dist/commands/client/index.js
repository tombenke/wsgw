#!/usr/bin/env node

/*jshint node: true */
'use strict';

var _socket = require('socket.io-client');

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 'client' command implementation
 *
 * @arg {Object} container - Container context object, holds config data of the application and supporting functions.
 * @arg {Object} args - Command arguments object. Contains the name-value pairs of command arguments.
 *
 * @function
 */
exports.execute = function (container, args) {
    container.logger.info(container.config.app.name + ' client ' + JSON.stringify(args));
    var serverUri = args.uri || 'http://localhost:' + container.config.wsServer.port;
    var wsClient = (0, _socket2.default)(serverUri);

    container.logger.info(JSON.stringify(args.message) + ' >> [' + args.topic + ']');
    wsClient.emit(args.topic, args.message, function (confirmation) {
        container.logger.info('Got confirmation: ' + confirmation);
        wsClient.close();
    });
    /*
    wsClient.on(args.topic, data => {
        container.logger.info(`[${args.topic}] >> ${JSON.stringify(data)}`)
    })
    */
};