#!/usr/bin/env node

/*jshint node: true */
'use strict';

var _socket = require('socket.io-client');

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 'consumer' command implementation
 *
 * @arg {Object} container - Container context object, holds config data of the application and supporting functions.
 * @arg {Object} args - Command arguments object. Contains the name-value pairs of command arguments.
 *
 * @function
 */
exports.execute = function (container, args, responseCb) {
    container.logger.info(container.config.app.name + ' client ' + JSON.stringify(args));
    var serverUri = args.uri || 'http://localhost:' + container.config.wsServer.port;

    if (args.channelType === 'NATS') {
        container.logger.info('Start listening to messages on NATS "' + args.topic + '" topic');
        //container.pdms.add({ pubsub$: true, topic: args.topic }, (data) => {
        container.pdms.subscribe(topic, function (data) {
            container.logger.info('NATS[' + args.topic + '] >> ' + JSON.stringify(data) + '\n');
        });
    } else {
        container.logger.info('Start listening to messages on WebSocket "' + args.topic + '" topic');
        var wsClient = (0, _socket2.default)(serverUri);

        wsClient.on(args.topic, function (data) {
            container.logger.info('WS[' + args.topic + '] >> ' + JSON.stringify(data) + '\n');
        });
    }
};