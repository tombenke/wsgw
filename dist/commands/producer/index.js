'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.loadMessagesFromFile = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _rxjs = require('rxjs');

var _operators = require('rxjs/operators');

var _datafile = require('datafile');

var _ws = require('./ws');

var _nats = require('./nats');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var loadMessagesFromFile = exports.loadMessagesFromFile = function loadMessagesFromFile(container, hostFileName, messageFileName) {
    var delay = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

    //container.logger.info(`loadMessagesFromFile("${hostFileName}", "${messageFileName}", delay=${delay})`)
    var messages = [];
    if (!_lodash2.default.isString(hostFileName) || !_lodash2.default.isString(messageFileName)) {
        return messages;
    }
    var content = (0, _datafile.loadJsonFileSync)(_path2.default.resolve(_path2.default.dirname(hostFileName), _path2.default.basename(messageFileName)));

    // If this is a single message, then make a messages array from it
    if (_lodash2.default.isArray(content)) {
        var firstItem = _lodash2.default.head(content);
        if (_lodash2.default.has(firstItem, 'message')) {
            var firstMessage = _extends({}, firstItem, { delay: delay + _lodash2.default.get(firstItem, 'delay', 0) });
            messages = _lodash2.default.concat(firstMessage, _lodash2.default.tail(content));
        } else {
            messages = content;
        }
    } else if (_lodash2.default.isObject(content) && _lodash2.default.has(content, ['topic']) /* && _.has(content, ['payload'])*/) {
            messages = [{ delay: delay, message: content }];
        }

    return _lodash2.default.chain(messages).flatMap(function (item) {
        return _lodash2.default.has(item, 'file') ? loadMessagesFromFile(container, hostFileName, item.file, _lodash2.default.get(item, 'delay', 0)) : item;
    }).value().map(function (item) {
        return { delay: _lodash2.default.get(item, 'delay', 0), message: _lodash2.default.get(item, 'message', {}) };
    });
};

var getMessagesToPublish = function getMessagesToPublish(container, args) {
    var directMessage = args.message != null ? [{ delay: 0, message: args.message }] : [];
    var messagesToPublish = _lodash2.default.concat(directMessage, loadMessagesFromFile(container, args.source, args.source, 0));
    if (args.dumpMessages) {
        container.logger.info('Messages to publish: ' + JSON.stringify(messagesToPublish, null, '  '));
    }

    return messagesToPublish;
};

var publishMessages = function publishMessages(messages, topic, emitMessageFun) {
    return new Promise(function (resolve, reject) {
        //console.log('publishMessages: ', JSON.stringify(messages, null, '  '))
        (0, _rxjs.from)(messages).pipe((0, _operators.scan)(function (accu, message) {
            return _lodash2.default.merge({}, message, { delay: accu.delay + message.delay });
        }, { delay: 0 }), (0, _operators.delayWhen)(function (message) {
            return (0, _rxjs.interval)(message.delay);
        }), (0, _operators.mergeMap)(function (message) {
            return emitMessageFun(topic, message.message);
        })).subscribe(function (message) {
            /*console.log(message)*/
        }, function (err) {
            return reject(err);
        }, function () {
            return resolve();
        });
    });
};

/**
 * 'producer' command implementation
 *
 * @arg {Object} container - Container context object, holds config data of the application and supporting functions.
 * @arg {Object} args - Command arguments object. Contains the name-value pairs of command arguments.
 *
 * @function
 */
exports.execute = function (container, args, endCb) {
    container.logger.info(container.config.app.name + ' client ' + JSON.stringify(args));
    var serverUri = args.uri || 'http://localhost:' + container.config.wsServer.port;
    var messagesToPublish = getMessagesToPublish(container, args);

    if (args.channelType === 'NATS') {
        container.logger.info('It sends messages through NATS');
        publishMessages(messagesToPublish, args.topic, (0, _nats.emitMessageNats)(container, args.rpc)).then((0, _nats.finishWithSuccessNats)(container, endCb)).catch((0, _nats.finishWithErrorNats)(container, endCb));
    } else {
        container.logger.info('It sends messages through websocket');
        var wsClient = (0, _ws.getWsClient)(serverUri);
        publishMessages(messagesToPublish, args.topic, (0, _ws.emitMessageWs)(container, wsClient)).then((0, _ws.finishWithSuccessWs)(container, wsClient, endCb)).catch((0, _ws.finishWithErrorWs)(container, wsClient, endCb));
    }
};