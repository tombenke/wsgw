'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _socket = require('socket.io-client');

var _socket2 = _interopRequireDefault(_socket);

var _rxjs = require('rxjs');

var _operators = require('rxjs/operators');

var _datafile = require('datafile');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var loadMessagesFromFile = function loadMessagesFromFile(fileName) {
    return _lodash2.default.chain((0, _datafile.loadJsonFileSync)(fileName, false)).flatMap(function (item) {
        return _lodash2.default.chain(_lodash2.default.concat(_lodash2.default.get(item, 'message', []), _lodash2.default.has(item, 'file') ? loadFromJsonSync(item.file) : [])).map(function (message) {
            return { delay: _lodash2.default.get(item, 'delay', 0), message: message };
        }).value();
    }).value();
};

/**
 * 'producer' command implementation
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

    var directMessage = args.message != null ? [{ delay: 0, message: args.message }] : [];
    var messagesToPublish = _lodash2.default.concat(directMessage, loadMessagesFromFile(args.source));
    var finishWithSuccess = function finishWithSuccess() {
        container.logger.info('Successfully completed.');
        wsClient.close();
    };
    var finishWithError = function finishWithError(err) {
        container.logger.error('ERROR: ' + err + '!');
        wsClient.close();
    };

    (0, _rxjs.from)(messagesToPublish).pipe((0, _operators.delayWhen)(function (message) {
        return (0, _rxjs.interval)(message.delay);
    }), (0, _operators.mergeMap)(function (message) {
        return new Promise(function (resolve, reject) {
            wsClient.emit(args.topic, message.message, function (confirmation) {
                container.logger.debug('Got confirmation: ' + confirmation);
                container.logger.info(JSON.stringify(message.message) + ' >> [' + args.topic + ']');
                resolve(message);
            });
        });
    })).subscribe(function (message) {
        console.log(message);
    }, finishWithError, finishWithSuccess);
};