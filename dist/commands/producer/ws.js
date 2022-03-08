'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.emitMessageWs = exports.finishWithErrorWs = exports.finishWithSuccessWs = exports.getWsClient = undefined;

var _socket = require('socket.io-client');

var _socket2 = _interopRequireDefault(_socket);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getWsClient = exports.getWsClient = function getWsClient(serverUri) {
    return (0, _socket2.default)(serverUri);
};

var finishWithSuccessWs = exports.finishWithSuccessWs = function finishWithSuccessWs(container, wsClient, endCb) {
    return function () {
        container.logger.info('Successfully completed.');
        wsClient.close();
        endCb(null, null);
    };
};
var finishWithErrorWs = exports.finishWithErrorWs = function finishWithErrorWs(container, wsClient, endCb) {
    return function (err) {
        container.logger.error('ERROR: ' + err + '!');
        wsClient.close();
        endCb(err, null);
    };
};

var emitMessageWs = exports.emitMessageWs = function emitMessageWs(container, wsClient) {
    return function (topic, message) {
        return new Promise(function (resolve, reject) {
            var strToEmit = _lodash2.default.isString(message) ? message : JSON.stringify(message);
            container.logger.info(strToEmit + ' >> [' + topic + ']');
            wsClient.emit(topic, strToEmit, function (confirmation) {
                container.logger.debug('Got confirmation: ' + confirmation);
                resolve(message);
            });
        });
    };
};