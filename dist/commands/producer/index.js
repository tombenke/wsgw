'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.loadMessagesFromFile = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _socket = require('socket.io-client');

var _socket2 = _interopRequireDefault(_socket);

var _rxjs = require('rxjs');

var _operators = require('rxjs/operators');

var _datafile = require('datafile');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//const loadMessageFile = (hostFileName, messageFileName) =>
//    loadJsonFileSync(path.resolve(path.dirname(hostFileName), messageFileName))

var loadMessagesFromFile = exports.loadMessagesFromFile = function loadMessagesFromFile(hostFileName, messageFileName) {
    var delay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    console.log('loadMessagesFromFile(' + hostFileName + ',' + messageFileName + ',' + delay + ')');
    var messages = [];
    var content = (0, _datafile.loadJsonFileSync)(_path2.default.resolve(_path2.default.dirname(hostFileName), _path2.default.basename(messageFileName)), false);

    // If this is a single message, then make a messages array from it
    if (_lodash2.default.isArray(content)) {
        messages = content;
    } else if (_lodash2.default.isObject(content) && _lodash2.default.has(content, ['topic']) && _lodash2.default.has(content, ['payload'])) {
        messages = [{ delay: delay, message: content }];
    }

    return _lodash2.default.chain(messages).flatMap(function (item) {
        return (
            //            _.chain(_.concat(_.get(item, 'message', []), _.has(item, 'file') ? loadMessagesFromFile(hostFileName, item.file, _.get(item, 'delay', 0)) : []))
            //                .map(message => ({ delay: _.get(item, 'delay', 0), message: message }))
            //                .value())
            _lodash2.default.has(item, 'file') ? loadMessagesFromFile(hostFileName, item.file, _lodash2.default.get(item, 'delay', 0)) : item
        );
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
    var messagesToPublish = _lodash2.default.concat(directMessage, loadMessagesFromFile(args.source, args.source, 0));
    var finishWithSuccess = function finishWithSuccess() {
        container.logger.info('Successfully completed.');
        wsClient.close();
    };
    var finishWithError = function finishWithError(err) {
        container.logger.error('ERROR: ' + err + '!');
        wsClient.close();
    };

    (0, _rxjs.from)(messagesToPublish).pipe((0, _operators.scan)(function (accu, message) {
        return _lodash2.default.merge({}, message, { delay: accu.delay + message.delay });
    }, { delay: 0 }), (0, _operators.delayWhen)(function (message) {
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