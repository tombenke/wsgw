'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.loadMessageContentFromFile = exports.loadMessagesFromScenarioFile = undefined;

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

var loadMessagesFromScenarioFile = exports.loadMessagesFromScenarioFile = function loadMessagesFromScenarioFile(container, topic, scenarioFileName) {
    container.logger.debug('loadMessagesFromScenarioFile(scenarioFileName: "' + scenarioFileName + '")');
    var messages = [];
    if (!_lodash2.default.isString(scenarioFileName) || scenarioFileName === '') {
        return messages;
    }
    var scenario = (0, _datafile.loadJsonFileSync)(_path2.default.resolve(scenarioFileName));

    if (_lodash2.default.isArray(scenario)) {
        var basePath = _path2.default.dirname(scenarioFileName);
        messages = _lodash2.default.chain(scenario).flatMap(function (item) {
            return _lodash2.default.has(item, 'scenario') ? loadMessagesFromScenarioFile(container, topic, _path2.default.resolve(basePath, item.scenario)) : _lodash2.default.has(item, 'file') ? loadMessageContentFromFile(container, item.delay, item.topic, _path2.default.resolve(basePath, item.file)) : item;
        }).value().map(function (item) {
            return {
                delay: _lodash2.default.get(item, 'delay', 0),
                topic: _lodash2.default.get(item, 'topic', topic),
                message: _lodash2.default.get(item, 'message', {})
            };
        });
    }

    return messages;
};

var loadMessageContentFromFile = exports.loadMessageContentFromFile = function loadMessageContentFromFile(container, delay, topic, messageFileName) {
    container.logger.debug('loadMessageContentFromFile(messageFileName: "' + messageFileName + '")');
    var messages = [];
    if (!_lodash2.default.isString(messageFileName)) {
        return messages;
    }
    var content = (0, _datafile.loadJsonFileSync)(_path2.default.resolve(messageFileName));
    messages = [{ delay: delay, topic: topic, message: content }];
    return messages;
};

var getMessagesToPublish = function getMessagesToPublish(container, args) {
    var directMessage = args.message != null ? [{ delay: 0, topic: args.topic, message: args.message }] : [];
    var messagesToPublish = _lodash2.default.concat(directMessage, loadMessageContentFromFile(container, 0, args.topic, args.messageContent), loadMessagesFromScenarioFile(container, args.topic, args.scenario));
    if (args.dumpMessages) {
        container.logger.info('Messages to publish: ' + JSON.stringify(messagesToPublish, null, '  '));
    }

    return messagesToPublish;
};

var publishMessages = function publishMessages(messages, topic, emitMessageFun) {
    return new Promise(function (resolve, reject) {
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
    container.logger.debug(container.config.app.name + ' client ' + JSON.stringify(args));
    var serverUri = args.uri || 'http://localhost:' + container.config.wsServer.port;
    var messagesToPublish = getMessagesToPublish(container, args);

    if (args.channelType === 'NATS') {
        container.logger.debug('It sends messages through NATS');
        publishMessages(messagesToPublish, args.topic, (0, _nats.emitMessageNats)(container, args.rpc)).then((0, _nats.finishWithSuccessNats)(container, endCb)).catch((0, _nats.finishWithErrorNats)(container, endCb));
    } else {
        container.logger.debug('It sends messages through websocket');
        var wsClient = (0, _ws.getWsClient)(serverUri);
        publishMessages(messagesToPublish, args.topic, (0, _ws.emitMessageWs)(container, wsClient)).then((0, _ws.finishWithSuccessWs)(container, wsClient, endCb)).catch((0, _ws.finishWithErrorWs)(container, wsClient, endCb));
    }
};